const express = require('express');
const poll = express.Router();
const mongoose = require('../db/db').mongoose;
const pollSchema = mongoose.Schema({
  question: String,
  response: { type: mongoose.Schema.Types.Mixed, default: { '1': 'YES', '2': 'NO' } }
});
const Poll = mongoose.model('Poll', pollSchema);

poll.get('/', function (req, res) {
  res.json({ 'success': true, 'message': 'Poll Home' });
});

poll.get('/all', function (req, res) {

  var query = Poll.where({}).sort('question');
  query.find(function (err, docs) {
    if (err) {
      console.log(err);
      res.json({ 'success': false, 'message': 'Server Internal Error.' });
    }
    if (docs == null) {
      res.json({ 'success': false, 'message': 'There are no polls' });
    } else {
      if (docs.length == 0) {
        res.json({ 'success': false, 'message': 'There are no polls' });
      } else {
        res.json({ 'success': true, 'message': 'Polls Fetched', 'polls': docs });
      }
    }
  });

});

poll.post('/new', function (req, res) {

  var query = Poll.where({ question: req.body.question });
  query.findOne(function (err, doc) {
    if (err) {
      console.log(err);
      res.json({ 'success': false, 'message': 'Server Internal Error.' });
    }
    if (doc == null) {
      var poll = new Poll({
        question: req.body.question
      });

      poll.save(function (err) {
        if (err) {
          console.log(err);
          res.json({ 'success': false, 'message': 'Server Internal Error.' });
        }
        res.json({ 'success': true, 'message': 'Poll question added.' });
      });
    } else {
      res.json({ 'success': false, 'message': 'Poll is already added. Try a new one.' });
    }
  });

});

module.exports = poll;