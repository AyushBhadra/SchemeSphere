const Scheme = require('../models/Scheme');

const toLower = (value) => (value == null ? '' : String(value).trim().toLowerCase());

const listAllowsValue = (list, value) => {
  if (!Array.isArray(list) || list.length === 0) return true;
  if (list.some((item) => toLower(item) === 'all')) return true;
  return list.some((item) => toLower(item) === toLower(value));
};

const evaluateScheme = (scheme, quiz) => {
  const criteria = scheme.criteria || {};
  const checks = [];

  const age = Number(quiz.age);
  if (criteria.minAge != null) {
    const passed = !Number.isNaN(age) && age >= criteria.minAge;
    checks.push({ key: 'minAge', passed, weight: 1 });
  } else {
    checks.push({ key: 'minAge', passed: true, weight: 1 });
  }

  if (criteria.maxAge != null) {
    const passed = !Number.isNaN(age) && age <= criteria.maxAge;
    checks.push({ key: 'maxAge', passed, weight: 1 });
  } else {
    checks.push({ key: 'maxAge', passed: true, weight: 1 });
  }

  const genderRule = criteria.gender || 'Any';
  const genderPassed =
    toLower(genderRule) === 'any' || toLower(genderRule) === toLower(quiz.gender);
  checks.push({ key: 'gender', passed: genderPassed, weight: 1 });

  // Treat maxAnnualIncome of 0, null, or undefined as "no income cap"
  if (criteria.maxAnnualIncome != null && criteria.maxAnnualIncome > 0) {
    const income = Number(quiz.annualIncome);
    const passed = !Number.isNaN(income) && income <= criteria.maxAnnualIncome;
    checks.push({ key: 'annualIncome', passed, weight: 1 });
  } else {
    checks.push({ key: 'annualIncome', passed: true, weight: 1 });
  }

  const occupationPassed = listAllowsValue(
    criteria.targetOccupations,
    quiz.occupation
  );
  checks.push({ key: 'occupation', passed: occupationPassed, weight: 1 });

  const stateRule = criteria.state || 'All-India';
  const statePassed =
    toLower(stateRule) === 'all-india' ||
    toLower(stateRule) === 'all' ||
    toLower(stateRule) === toLower(quiz.state);
  checks.push({ key: 'state', passed: statePassed, weight: 1 });

  const castePassed = listAllowsValue(criteria.casteCategories, quiz.category);
  checks.push({ key: 'category', passed: castePassed, weight: 1 });

  const passedCount = checks.filter((c) => c.passed).length;
  const matchPercentage = Math.round((passedCount / checks.length) * 100);
  const eligible = checks.every((c) => c.passed);

  return {
    eligible,
    matchPercentage,
    suitability: eligible ? 'Eligible' : 'Partially eligible',
    failedChecks: checks.filter((c) => !c.passed).map((c) => c.key),
  };
};

const matchSchemes = async (req, res) => {
  try {
    const { age, gender, annualIncome, occupation, state, category } = req.body;

    if (
      age == null ||
      !gender ||
      annualIncome == null ||
      !occupation ||
      !state ||
      !category
    ) {
      return res.status(400).json({
        message:
          'age, gender, annualIncome, occupation, state and category are required',
      });
    }

    const schemes = await Scheme.find({});
    const quiz = { age, gender, annualIncome, occupation, state, category };

    const matches = schemes
      .map((scheme) => {
        const result = evaluateScheme(scheme, quiz);
        return {
          scheme,
          matchPercentage: result.matchPercentage,
          suitability: result.suitability,
          failedChecks: result.failedChecks,
          eligible: result.eligible,
        };
      })
      .filter((item) => item.matchPercentage >= 70)
      .sort((a, b) => b.matchPercentage - a.matchPercentage);

    res.status(200).json({
      count: matches.length,
      matches,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to match schemes', error: error.message });
  }
};

module.exports = { matchSchemes };
