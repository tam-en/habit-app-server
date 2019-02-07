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
    db.Habit.findOneAndUpdate({ 
        id: req.params.userid }, 
        req.body, { new: true })
    .then(habit => {
        res.send(habit)
    })
    .catch(err =>{
        console.log(err);
        res.status(500).send({message: 'Server Error'})
    });
})

// Let a user enter daily completions
router.put('/completions/:userid', (req, res) => {
    let today = req.body.date
    db.Habit.findbyId(req.params.habit._id)
    .then(habit => {
        dates = habit.days.map((date) => {
            return date.date
        })
        const indexOfToday = dates.indexOf(today)
        var newDaysArray = habit.days
        console.log("newDaysArray=", newDaysArray)
        if(indexOfToday != -1) {
            console.log("Completion day already exists, ending completion")
            // today's completion aready exists, needs to be edited       
            newDaysArray[indexOfToday] = req.body.dayData
        } else {
            console.log("Creating new day in completions array")
            // today's completion doesn't exist yet, need to be created and pushed
            newDaysArray = newDaysArray.push(req.body.dayData)
        }
        db.findOneAndUpdate({ id: habit.id }, {days: newDaysArray})
        .then(habit => {
            res.status(200).send(habit)
        })
        .catch(err => {
            res.send("ERORR!")
        })
       
        res.send(habit)
    })
    .catch(err =>{
		console.log(err);
		res.status(500).send({message: 'Server Error'})
    });
});
    
router.delete('/:userid', (req, res) => {
    db.Habits.findOneAndDelete({ name: req.body.habit.id, user: req.params.userid })
    .then(() => {
        res.status(204).send({ messgae: 'successful Deletion' })
    })
    .catch(err =>{
            console.log(err);
            res.status(500).send({message: 'Server Error'})
        });
    });


module.exports = router;