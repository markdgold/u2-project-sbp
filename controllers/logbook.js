var express = require('express');
var db = require('../models');
var async = require('async');
var router = express.Router();

router.get('/', (req,res) =>{
    db.climb_send.findAll({
        where: {user_id: req.session.passport.user}
    })
    .then(sentClimbs => {
        var getSentClimbsFn = function(sentClimb, callback){
            db.climb.findAll({
                where: {id: sentClimb.climb_id},
                include: [db.grade, db.user]
            })
            .then(sentClimbFull =>{
                callback(null, sentClimbFull);
            });
        };
        async.concat(sentClimbs, getSentClimbsFn, function(err, result){
            console.log(result);
            res.render('logbook', {sentClimbs: result});
        });
    });
});

router.post('/:id', (req,res) =>{
    db.climb_send.findOrCreate({
        where: {user_id: req.body.userId, climb_id: req.params.id}
    }).spread((send, wasCreated)=>{
        if (wasCreated){
            req.flash('success', 'Climb added to logbook');
            res.redirect('/');
        }
        else {
            req.flash('error', 'Climb already in logbook');
            res.redirect('/');
        }
    }).catch(function(error){
        req.flash('error', error.message);
        res.redirect('/');
    });
});

router.delete('/:id', (req, res) => {
    db.climb_send.destroy({
        where: {climb_id: req.params.id, user_id: req.session.passport.user}
    }).then(() => {
        res.redirect('/logbook');
    });
});

//Export
module.exports = router;
