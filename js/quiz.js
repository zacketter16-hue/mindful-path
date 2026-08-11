(function () {
  // Kit inline form "Clare form" (uid 870c6ec05f). Public endpoint by design —
  // no API key belongs in client-side code.
  var KIT_FORM_ACTION = "https://app.kit.com/forms/9790827/subscriptions";

  var TOPICS = {
    anxiety: { name: "Anxiety", url: "/topics/anxiety.html", blurb: "Your answers point to worry, tension, and a mind that struggles to settle. The Anxiety playbook builds the skills to calm your body and quiet the noise." },
    depression: { name: "Depression", url: "/topics/depression.html", blurb: "Your answers point to low mood, low energy, and a loss of interest in things that used to matter. The Depression playbook helps you rebuild momentum step by step." },
    adhd: { name: "ADHD", url: "/topics/adhd.html", blurb: "Your answers point to focus, restlessness, and follow-through getting in your way. The ADHD playbook gives you structure that actually fits how your brain works." },
    breakup: { name: "Relationships & Breakups", url: "/topics/breakup.html", blurb: "Your answers point to heartbreak, connection, and self-worth inside relationships. The Relationships & Breakups playbook helps you heal and reset your patterns." },
    "job-loss": { name: "Financial Stress", url: "/topics/job-loss.html", blurb: "Your answers point to money pressure and the hit it takes on your confidence and sense of purpose. The Financial Stress playbook helps you steady both." },
    grief: { name: "Grief & Loss", url: "/topics/grief.html", blurb: "Your answers point to loss you are still carrying. The Grief & Loss playbook helps you process it properly instead of pushing it down." },
    "injury-illness": { name: "Burnout", url: "/topics/injury-illness.html", blurb: "Your answers point to depletion — running on empty and losing the drive you used to have. The Burnout playbook helps you refill the tank." },
    sexuality: { name: "Sexuality", url: "/topics/sexuality.html", blurb: "Your answers point to identity, intimacy, and self-acceptance. The Sexuality playbook is a space to work through that honestly." },
    addiction: { name: "Addiction", url: "/topics/addiction.html", blurb: "Your answers point to a pattern you keep returning to despite knowing where it leads. The Addiction playbook builds the coping skills to break the loop." },
    adjustment: { name: "Low Motivation", url: "/topics/adjustment.html", blurb: "Your answers point to a drive that has gone quiet. The Low Motivation playbook helps you understand why — and what actually restarts it." },
    "goal-setting": { name: "Goal Setting", url: "/topics/goal-setting.html", blurb: "Your answers point to knowing you want more but not having a plan that holds. The Goal Setting playbook builds goals around your values and the barriers you will hit." },
    "self-esteem": { name: "Confidence & Self-Worth", url: "/topics/self-esteem.html", blurb: "Your answers point to a harsh inner voice running the show. The Confidence & Self-Worth playbook helps you challenge it and rebuild belief in yourself." }
  };

  var QUESTIONS = [
    {
      q: "When you think about the past two weeks, what has been hardest?",
      a: [
        { t: "My mind won't stop racing", w: { anxiety: 3, "injury-illness": 1 } },
        { t: "I've felt flat, heavy, or numb", w: { depression: 3, adjustment: 1 } },
        { t: "I can't focus or finish anything", w: { adhd: 3, adjustment: 1 } },
        { t: "I've been stuck on someone or something I lost", w: { grief: 3, breakup: 1 } }
      ]
    },
    {
      q: "Which sounds most like your inner voice on a bad day?",
      a: [
        { t: "\"Something bad is about to happen.\"", w: { anxiety: 3 } },
        { t: "\"I'm not good enough.\"", w: { "self-esteem": 3, depression: 1 } },
        { t: "\"What's even the point?\"", w: { depression: 2, adjustment: 2 } },
        { t: "\"I should be further along by now.\"", w: { "goal-setting": 2, "self-esteem": 1, "job-loss": 1 } }
      ]
    },
    {
      q: "Where do you feel the most pressure right now?",
      a: [
        { t: "Money, work, or job security", w: { "job-loss": 3 } },
        { t: "My relationship or dating life", w: { breakup: 3 } },
        { t: "My health, energy, or body", w: { "injury-illness": 3 } },
        { t: "Who I am and where I'm headed", w: { sexuality: 2, "goal-setting": 2 } }
      ]
    },
    {
      q: "How is your energy these days?",
      a: [
        { t: "Wired and on edge — I can't relax", w: { anxiety: 3 } },
        { t: "Completely drained, even after resting", w: { "injury-illness": 3, depression: 1 } },
        { t: "It comes in bursts, then disappears", w: { adhd: 2, adjustment: 2 } },
        { t: "Steady — energy isn't my problem", w: { "goal-setting": 2 } }
      ]
    },
    {
      q: "Is there a habit or behavior you keep going back to, even when it costs you?",
      a: [
        { t: "Yes — and I've tried to stop more than once", w: { addiction: 4 } },
        { t: "Sometimes, when I'm stressed", w: { addiction: 2, anxiety: 1 } },
        { t: "I avoid things instead — I shut down", w: { depression: 2, adjustment: 2 } },
        { t: "No, that's not really my struggle", w: {} }
      ]
    },
    {
      q: "When something goes wrong, what happens next for you?",
      a: [
        { t: "I replay it over and over", w: { anxiety: 2, "self-esteem": 2 } },
        { t: "I blame myself and it sticks", w: { "self-esteem": 3, depression: 1 } },
        { t: "I lose all momentum on everything else", w: { adjustment: 3 } },
        { t: "I push through and don't process it", w: { "injury-illness": 2, grief: 2 } }
      ]
    },
    {
      q: "If one thing changed in the next 90 days, what would matter most?",
      a: [
        { t: "Feeling calmer and more in control", w: { anxiety: 3 } },
        { t: "Feeling like myself again", w: { depression: 2, grief: 2 } },
        { t: "Actually following through on my goals", w: { "goal-setting": 3, adhd: 1 } },
        { t: "Believing I'm worth it", w: { "self-esteem": 3 } }
      ]
    }
  ];

  var answers = [];
  var current = 0;
  var result = null;

  var elQuiz = document.getElementById("quiz-step");
  var elProgress = document.getElementById("quiz-progress");
  var elEmail = document.getElementById("quiz-email-step");
  var elResult = document.getElementById("quiz-result-step");

  function score() {
    var totals = {};
    answers.forEach(function (choice) {
      Object.keys(choice.w).forEach(function (k) {
        totals[k] = (totals[k] || 0) + choice.w[k];
      });
    });
    var best = null;
    Object.keys(totals).forEach(function (k) {
      if (!best || totals[k] > totals[best]) best = k;
    });
    return best || "goal-setting";
  }

  function renderQuestion() {
    var item = QUESTIONS[current];
    elProgress.textContent = "Question " + (current + 1) + " of " + QUESTIONS.length;
    elProgress.style.width = "";
    var html = '<h2 class="quiz-q">' + item.q + "</h2>";
    html += '<div class="quiz-options">';
    item.a.forEach(function (opt, i) {
      html += '<button type="button" class="quiz-option" data-i="' + i + '">' + opt.t + "</button>";
    });
    html += "</div>";
    if (current > 0) {
      html += '<button type="button" class="quiz-back" id="quiz-back">← Back</button>';
    }
    elQuiz.innerHTML = html;

    elQuiz.querySelectorAll(".quiz-option").forEach(function (btn) {
      btn.addEventListener("click", function () {
        answers[current] = item.a[parseInt(btn.dataset.i, 10)];
        current++;
        if (current < QUESTIONS.length) {
          renderQuestion();
        } else {
          showEmailStep();
        }
      });
    });

    var back = document.getElementById("quiz-back");
    if (back) {
      back.addEventListener("click", function () {
        current--;
        renderQuestion();
      });
    }
  }

  function showEmailStep() {
    result = score();
    elQuiz.style.display = "none";
    elProgress.style.display = "none";
    elEmail.style.display = "";
  }

  var INCLUDED = [
    "<strong>All 12 Playbooks</strong> — self-paced modules you can work through anytime, not just the one above",
    "<strong>Live Events</strong> — monthly calendar with live workshops, Q&amp;A and guests. Plus replays if you miss one",
    "<strong>Private Member Community</strong> — a members-only group to share wins and ask questions",
    "<strong>Weekly Challenges &amp; Prompts</strong> — reflection prompts, discussion threads, and Q&amp;A throughout the week",
    "<strong>A Say in What's Next</strong> — members vote on upcoming Live Event topics"
  ];

  function showResult() {
    var topic = TOPICS[result];
    elEmail.style.display = "none";
    elResult.style.display = "";

    var list = INCLUDED.map(function (item) {
      return '<li><span class="quiz-check" aria-hidden="true">&#10003;</span><span>' + item + "</span></li>";
    }).join("");

    elResult.innerHTML =
      '<p class="quiz-result-label">Your recommended playbook</p>' +
      '<h2 class="quiz-result-title">' + topic.name + " Playbook</h2>" +
      '<p class="quiz-result-blurb">' + topic.blurb + "</p>" +
      '<p class="quiz-result-disclaimer">This isn\'t a diagnosis — it\'s where we\'d suggest starting based on your answers. You get every playbook either way.</p>' +
      '<div class="quiz-included">' +
        "<h3>Your membership includes</h3>" +
        '<ul class="quiz-included-list">' + list + "</ul>" +
      "</div>" +
      '<div class="quiz-cta-block">' +
        '<a class="btn quiz-result-cta" href="/index.html#auth-section">Start My Free Trial</a>' +
        '<p class="quiz-result-sub">3 days free, then $24.99/month. Cancel anytime.</p>' +
      "</div>" +
      '<p class="quiz-result-trust">Created by Zack Etter, LPC, CMPC — licensed therapist and certified mental performance coach.</p>';

    try {
      sessionStorage.setItem("mfl-quiz-topic", result);
    } catch (e) {}
  }

  document.getElementById("quiz-email-form").addEventListener("submit", function (e) {
    e.preventDefault();
    var email = document.getElementById("quiz-email").value;
    var msg = document.getElementById("quiz-email-msg");
    var btn = document.getElementById("quiz-email-btn");
    if (!email) return;
    btn.disabled = true;
    msg.textContent = "";

    var payload = {
      email: email,
      recommendedTopic: result,
      answers: JSON.stringify(answers.map(function (a) { return a.t; }))
    };

    // Kit (email marketing) is the list that actually gets emailed; the
    // Memberstack table is a backup record. Neither is allowed to block the
    // result — a lead is worth less than a visitor who bounces on an error.
    var saves = [];

    saves.push(
      fetch(KIT_FORM_ACTION, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          email_address: email,
          "fields[quiz_result]": TOPICS[result].name
        }).toString()
      }).catch(function () {})
    );

    if (window.$memberstackDom && window.$memberstackDom.createDataRecord) {
      saves.push(
        window.$memberstackDom
          .createDataRecord({ table: "quiz_leads", data: payload })
          .catch(function () {})
      );
    }

    Promise.all(saves).then(showResult, showResult);
  });

  renderQuestion();
})();
