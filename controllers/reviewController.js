const reviewModel = require("../models/review-model");

async function addReview(req, res, next) {
  try {
    const { inv_id, review_text } = req.body;
    const account_id = res.locals.accountData.account_id;

    if (!review_text.trim()) {
      req.flash("error", "Review text cannot be empty.");
      return res.redirect(`/inv/detail/${inv_id}`);
    }

    await reviewModel.addReview(inv_id, account_id, review_text);
    req.flash("success", "Review submitted!");
    res.redirect(`/inv/detail/${inv_id}`);
  } catch (error) {
    next(error);
  }
}

module.exports = { addReview };
