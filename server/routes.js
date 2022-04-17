const express = require('express');

const router = express.Router();

const LOS_DATES = [
  { day: '2022-04-18', LOS: 3 },
  { day: '2022-04-19', LOS: 2 },
  { day: '2022-04-20', LOS: 6 },
  { day: '2022-04-21', LOS: 4 },
  { day: '2022-04-22', LOS: 3 },
  { day: '2022-04-23', LOS: 2 },
  { day: '2022-04-24', LOS: 2 },
  { day: '2022-04-25', LOS: 2 },
  { day: '2022-04-26', LOS: 1 },
  { day: '2022-04-28', LOS: 1 },
  { day: '2022-04-29', LOS: 5 },
];

const UN_AVAILABLE_DATES = ['2022-04-28', '2022-05-25'];

router.get("/los", function (req, res) {
  res.json(LOS_DATES);
});

router.get("/unAvailableDates", function (req, res) {
  res.json(UN_AVAILABLE_DATES);
});

module.exports = router;