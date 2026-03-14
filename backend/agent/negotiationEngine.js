export function checkDeal(message, userProfile) {

  if (message.includes("$")) {

    const price = parseInt(message.replace(/\D/g, ""));

    if (price > userProfile.maxBudget) {

      return {
        allowed: false,
        reply: "That price is above what I can commit to right now."
      };

    }

  }

  return { allowed: true }

}