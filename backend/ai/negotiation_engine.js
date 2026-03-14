const fs = require("fs");
const path = require("path");

const examples = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../dataset/negotiation_examples.json"))
);

const rules = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../dataset/negotiation_rules.json"))
);

function evaluateOffer(offer) {
  const price = parseInt(offer);

  if (price < rules.min_offer) {
    return {
      decision: "reject",
      reason: "Below minimum threshold"
    };
  }

  if (price >= rules.target_offer) {
    return {
      decision: "accept"
    };
  }

  return {
    decision: "counter",
    counter_offer: rules.target_offer
  };
}

module.exports = { evaluateOffer };
