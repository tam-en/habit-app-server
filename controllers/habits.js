require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();
const db = require('../models');

// find all of a user's habits
router.get('/:userid', (req, res) => {
    db.Habit.find({ user: req.params.userid })
    .then(habits => {
        res.send(habits)
    })
    .catch(err => {
        console.log('error habits/dashboard GET Route', err)
    })
})

// Creating a new habit
router.post('/:userid', (req, res) => {
    db.Habit.create({
        name: req.body.name,
        timesPerDay: req.body.timesPerDay,
        description: req.body.description,
        days: [],
        user: req.body.user
    })
    .then(habit => {
        res.status(200).send(habit)
    })
    .catch(err => {
        res.status(404).send('Error made in POST habit route')
        console.log('error in /habit/POST Route', err)
    })
})

// Edit a habit
router.put('/:userid', (req, res) => {
    db.Habit.findOneAndUpdate({ id: req.params.id }, req.body, {new: true})
    .then(habit => {
        res.send(habit)
    })
    .catch(err =>{
        console.log(err);
        res.status(500).send({message: 'Server Error'})
    });
})

// Get the daily completion data to store as a state in the HabitDetail component
// router.get('/completion/:userid/:habitId', (req, res) => {
//     db.Habit.findById(req.params.habitId)
//     .then(habit => {
//         res.status(200).send(habit.days)
//     })
//     .catch(err => {
//         res.send("Error in the GET completions route");
//         console.log("Error in the GET completions route", err)
//     })
// })

// Let a user enter daily completions
router.put('/completions/:habitId', (req, res) => {
    db.Habit.findById(req.params.habitId)
    .then(habit => {
        dates = habit.days.map((date) => {
          // Thanks Stack Overflow
          // https://stackoverflow.com/questions/23593052/format-javascript-date-to-yyyy-mm-dd
          return date.date.toISOString().split('T')[0];
        });
        const indexOfToday = dates.indexOf(req.body.dayData.date)
        if(indexOfToday != -1) {
            // today's completion aready exists, needs to be edited
            habit.days[indexOfToday] = req.body.dayData
        }
        else {
            // today's completion doesn't exist yet, need to be created and pushed
            habit.days.push(req.body.dayData);
        }

        // We can push to the array, but then we need to save it!
        habit.save()
        .then(savedHabit => {
          res.status(200).send(savedHabit)
        })
        .catch(err => {
          console.log('error', err)
          res.status(501).send({message: "ERROR!"});
        });
    })
    .catch(err =>{
  		console.log(err);
  		res.status(500).send({message: 'Server Error'})
    });
});

router.delete('/:habitid', (req, res) => {
    db.Habit.findOneAndDelete({ id: req.params.habitid })
    .then(() => {
        res.status(204).send({ messgae: 'successful Deletion' })
    })
    .catch(err =>{
        console.log(err);
        res.status(500).send({message: 'Server Error'})
    });
});


module.exports = router;
