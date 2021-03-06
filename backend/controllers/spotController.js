"use strict";

var mongoose = require("mongoose");
const Spot = require("../models/spotModel");

// retrieve list of spots with matching criteria
// applies to any spots
exports.search_spots = function (req, res) {
  Spot.find(req.body, function (err, spot) {
    if (err) res.send(err);
    res.json(spot);
  });
};

// add spot
exports.insert_spot = function (req, res) {
  console.log(req.body);
  var new_spot = new Spot(req.body);
  console.log(`spot: ${new_spot}`);
  new_spot.save(function (err, spot) {
    if (err) res.send(err);
    res.json(spot);
  });
};

// retrieve single spot with matching id
exports.view_spot = function (req, res) {
  Spot.findById(req.params.spotId, function (err, spot) {
    if (err) res.send(err);
    res.json(spot);
  });
};

// update spot's rating
// need to first retrieve spot, then average-in new rating & update rating count
exports.rate_spot = async function (req, res) {
  try {
    const spot = await Spot.findById(req.body.spotId);

    const new_numberOfRatings = spot.numberOfRatings + 1;
    const specialty =
      (spot.specialty * spot.numberOfRatings + req.body.specialty) /
      new_numberOfRatings;
    const quality =
      (spot.quality * spot.numberOfRatings + req.body.quality) /
      new_numberOfRatings;
    const update = {
      quality: quality,
      specialty: specialty,
      numberOfRatings: new_numberOfRatings,
    };

    Spot.findOneAndUpdate(req.body.spotId, update, function (err, resp) {
      if (err) res.send(err);
      res.send("Successfully updated rating");
    });
  } catch (err) {
    res.send(err);
  }
};

// remove spot from database
exports.delete_spot = function (req, res) {
  Spot.deleteOne(
    {
      _id: req.body.spotId,
    },
    function (err, spot) {
      if (err) res.send(err);
      res.json({ message: "Spot successfully deleted" });
    }
  );
};
