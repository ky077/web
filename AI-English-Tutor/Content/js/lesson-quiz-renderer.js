(function (window, document) {
  'use strict';

  function toArray(list) {
    return Array.prototype.slice.call(list || []);
  }

  function normalizeText(value) {
    return String(value || '').replace(/\s+/g, ' ').trim();
  }

  function getFileName(path) {
    return String(path || '').split('/').pop().split('\\').pop();
  }

  function removeFileExtension(value) {
    return getFileName(value).replace(/\.(png|jpe?g|gif|webp|svg)(\?.*)?$/i, '');
  }

  function isAudioFile(value) {
    return /\.(mp3|wav|ogg|m4a)(\?.*)?$/i.test(String(value || ''));
  }

  function canUseSpeechSynthesis() {
    return 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
  }

  function speakText(text, onDone) {
    if (!canUseSpeechSynthesis()) {
      return false;
    }

    var done = function () {
      if (onDone) {
        onDone();
      }
    };
    var utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 1.0;
    utterance.onend = done;
    utterance.onerror = done;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    return true;
  }

  function getAudioIcon(button) {
    return button.querySelector('.fa-volume-low, .fa-volume, .fa-volume-high');
  }

  function setAudioIcon(button, iconClass) {
    var icon = getAudioIcon(button);

    if (!icon) {
      return;
    }

    icon.classList.remove('fa-volume-low', 'fa-volume', 'fa-volume-high');
    icon.classList.add(iconClass);
  }

  function stopAudioButtonAnimation(button) {
    if (!button) {
      return;
    }

    if (button._quizAudioIconTimer) {
      window.clearInterval(button._quizAudioIconTimer);
      button._quizAudioIconTimer = null;
    }

    delete button.dataset.audioPlaying;
    setAudioIcon(button, 'fa-volume-high');
  }

  function stopAllAudioButtonAnimations() {
    toArray(document.querySelectorAll('[data-audio-playing="true"]')).forEach(stopAudioButtonAnimation);
  }

  function startAudioButtonAnimation(button) {
    var iconClasses = ['fa-volume-low', 'fa-volume', 'fa-volume-high'];
    var index = 0;

    stopAllAudioButtonAnimations();
    stopAudioButtonAnimation(button);
    button.dataset.audioPlaying = 'true';
    setAudioIcon(button, iconClasses[index]);

    button._quizAudioIconTimer = window.setInterval(function () {
      index = (index + 1) % iconClasses.length;
      setAudioIcon(button, iconClasses[index]);
    }, 500);
  }

  function setText(root, selector, value) {
    var target = root.querySelector(selector);
    if (target && value !== undefined && value !== null) {
      target.textContent = value;
    }
  }

  function setImage(root, selector, image) {
    var target = root.querySelector(selector);
    if (!target || !image) {
      return;
    }

    var src = typeof image === 'string' ? image : image.src;
    var alt = typeof image === 'string' ? '' : image.alt;

    if (src) {
      target.setAttribute('src', src);
    }
    if (alt !== undefined && alt !== null) {
      target.setAttribute('alt', alt);
    }
  }

  function ensureQuestionData(layout, question, lesson, section) {
    var meta = layout.querySelector('.quiz-data');
    if (!meta) {
      meta = document.createElement('div');
      meta.className = 'quiz-data';
      meta.hidden = true;
      layout.insertBefore(meta, layout.firstChild);
    }

    meta.dataset.lessonOrder = lesson.lessonOrder;
    meta.dataset.lessonTitle = lesson.title;
    meta.dataset.section = section.id;
    meta.dataset.questionId = question.id;
    meta.dataset.quizLayout = question.layout;
    meta.dataset.answer = question.answer;
    meta.dataset.answerType = question.answerType || 'text';

    if (question.questionAudio) {
      meta.dataset.questionAudio = question.questionAudio;
    } else {
      delete meta.dataset.questionAudio;
    }
    if (question.questionAudioText) {
      meta.dataset.questionAudioText = question.questionAudioText;
    } else {
      delete meta.dataset.questionAudioText;
    }

    meta.textContent = JSON.stringify({
      id: question.id,
      layout: question.layout,
      questionAudio: question.questionAudio || '',
      questionAudioText: question.questionAudioText || '',
      answer: question.answer,
      answerType: question.answerType || 'text'
    });

    layout.dataset.questionId = question.id;
    layout.dataset.quizLayout = question.layout;
    layout.dataset.answer = question.answer;
    layout.dataset.answerType = question.answerType || 'text';

    if (question.questionAudio) {
      layout.dataset.questionAudio = question.questionAudio;
    } else {
      delete layout.dataset.questionAudio;
    }
    if (question.questionAudioText) {
      layout.dataset.questionAudioText = question.questionAudioText;
    } else {
      delete layout.dataset.questionAudioText;
    }
  }

  function updateQuestionNumber(layout, question) {
    var numberText = layout.querySelector('.quiz-instruction-num');
    var numberSpan = numberText ? numberText.querySelector('.mx-1') : null;

    if (numberSpan) {
      numberSpan.textContent = question.id;
    } else if (numberText) {
      numberText.textContent = '第' + question.id + '題';
    }
  }

  function updateAudioButtons(layout, question) {
    var buttons = toArray(layout.querySelectorAll('.quiz-content-audio button, .quiz-content-dialog button'));
    var audio = layout.querySelector('.quiz-question-audio');

    if (question.questionAudio && isAudioFile(question.questionAudio)) {
      if (!audio) {
        audio = document.createElement('audio');
        audio.className = 'quiz-question-audio';
        audio.preload = 'auto';
        audio.hidden = true;
        layout.insertBefore(audio, layout.firstChild);
      }

      audio.setAttribute('src', question.questionAudio);
    } else if (audio) {
      audio.remove();
      audio = null;
    }

    buttons.forEach(function (button) {
      if (question.questionAudio) {
        if (isAudioFile(question.questionAudio)) {
          button.dataset.audioSrc = question.questionAudio;
          if (question.questionAudioText) {
            button.dataset.audioText = question.questionAudioText;
          } else {
            delete button.dataset.audioText;
          }
          button.setAttribute('aria-label', '播放題目音檔');
          if (!button.dataset.audioBound) {
            button.dataset.audioBound = 'true';
            button.addEventListener('click', function () {
              var targetAudio;

              startAudioButtonAnimation(button);

              if (layout.dataset.questionAudioText && speakText(layout.dataset.questionAudioText, function () {
                stopAudioButtonAnimation(button);
              })) {
                return;
              }

              targetAudio = layout.querySelector('.quiz-question-audio');

              if (targetAudio) {
                targetAudio.addEventListener('ended', function () {
                  stopAudioButtonAnimation(button);
                }, { once: true });
                targetAudio.addEventListener('error', function () {
                  stopAudioButtonAnimation(button);
                }, { once: true });
                targetAudio.currentTime = 0;
                targetAudio.play().catch(function () {
                  stopAudioButtonAnimation(button);
                });
                return;
              }

              stopAudioButtonAnimation(button);
            });
          }
        } else {
          button.dataset.audioText = question.questionAudio;
          delete button.dataset.audioSrc;
          delete button.dataset.audioBound;
          button.setAttribute('aria-label', '播放聲音：' + question.questionAudio);
        }
      } else {
        delete button.dataset.audioText;
        delete button.dataset.audioSrc;
        delete button.dataset.audioBound;
        button.removeAttribute('aria-label');
      }
    });
  }

  function updateOptions(layout, question) {
    var labels = toArray(layout.querySelectorAll('.quiz-options label'));

    labels.forEach(function (label, index) {
      var option = question.options && question.options[index];
      var inputId = label.getAttribute('for');
      var input = inputId ? document.getElementById(inputId) : null;
      var optionValue;
      var optionDisplayText;

      if (option) {
        optionValue = option.value || option.label || getFileName(option.image);
        optionDisplayText = option.label || option.alt || removeFileExtension(optionValue);

        if (option.image) {
          var optionImage = label.querySelector('img');
          var optionTextElement = label.querySelector('div');

          if (optionImage) {
            optionImage.setAttribute('src', option.image);
            optionImage.setAttribute('alt', option.alt || option.label || optionValue);
          }
          if (optionTextElement && option.label) {
            optionTextElement.textContent = option.label;
          }
          if (!optionImage && option.label) {
            label.textContent = option.label;
          }
        } else if (option.label) {
          label.textContent = option.label;
        }
      } else {
        var image = label.querySelector('img');
        optionValue = image ? getFileName(image.getAttribute('src')) : normalizeText(label.textContent);
        optionDisplayText = normalizeText(label.textContent) || (image && normalizeText(image.getAttribute('alt'))) || removeFileExtension(optionValue);
      }

      if (optionValue) {
        label.dataset.optionValue = optionValue;
        label.dataset.optionText = optionDisplayText || removeFileExtension(optionValue);
        if (input) {
          input.value = optionValue;
        }
      }

      if (input && !label.dataset.optionBound) {
        var selectOption = function () {
          input.checked = true;
          input.dispatchEvent(new Event('change', { bubbles: true }));
          updateConfirmButtonsState(layout);
        };

        label.dataset.optionBound = 'true';
        label.addEventListener('pointerdown', selectOption, true);
        label.addEventListener('click', selectOption, true);
        label.addEventListener('keydown', function (event) {
          if (event.key === 'Enter' || event.key === ' ') {
            selectOption();
          }
        });
      }

      if (input && !input.dataset.quizAnswerBound) {
        input.dataset.quizAnswerBound = 'true';
        input.addEventListener('change', function () {
          updateConfirmButtonsState(layout);
        });
      }

      if (normalizeText(optionValue) === normalizeText(question.answer)) {
        label.dataset.isAnswer = 'true';
        if (input) {
          input.dataset.isAnswer = 'true';
        }
      } else {
        delete label.dataset.isAnswer;
        if (input) {
          delete input.dataset.isAnswer;
        }
      }
    });
  }

  function updatePrompt(layout, question) {
    setText(layout, '.quiz-instruction-text', question.instruction);
    setText(layout, '.quiz-content-tip', question.tip);
    setText(layout, '.quiz-content-text', question.promptText);
    setImage(layout, '.quiz-content-img img', question.promptImage);

    if (question.vocabWords) {
      var vocab = layout.querySelector('.quiz-content-vocab');
      var spans = vocab ? toArray(vocab.querySelectorAll('span')) : [];

      question.vocabWords.forEach(function (word, index) {
        if (spans[index]) {
          spans[index].textContent = word;
        }
      });
    }
  }

  function updateProgress(current, total) {
    var progress = document.querySelector('.quiz-progress');
    if (!progress || !total) {
      return;
    }

    var countSpans = toArray(progress.querySelectorAll('.progress-person-count .mx-1'));
    current = Math.min(Math.max(parseFloat(current) || 1, 1), total);
    var percent = Math.round((current / total) * 1000) / 10;
    var progressPerson = progress.querySelector('.progress-person');
    var progressBar = progress.querySelector('.progress-bar');
    var progressElement = progress.querySelector('.progress');

    if (countSpans[0]) {
      countSpans[0].textContent = current;
    }
    if (countSpans[1]) {
      countSpans[1].textContent = total;
    }
    if (progressPerson) {
      progressPerson.style.width = percent + '%';
    }
    if (progressBar) {
      progressBar.style.width = percent + '%';
    }
    if (progressElement) {
      progressElement.setAttribute('aria-valuenow', percent);
    }
  }

  function setFeedbackVisible(panel, visible) {
    if (!panel) {
      return;
    }

    panel.style.display = visible ? 'block' : 'none';
    panel.setAttribute('aria-hidden', visible ? 'false' : 'true');
  }

  function getFeedbackElements() {
    return {
      correct: document.querySelector('.answer-correct'),
      incorrect: document.querySelector('.answer-incorrect'),
      done: document.querySelector('.quiz-done')
    };
  }

  function normalizeAnswer(value) {
    return String(value || '')
      .toLowerCase()
      .replace(/\bi'm\b/g, 'i am')
      .replace(/\bim\b/g, 'i am')
      .replace(/[.,!?;:]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function getSpeechRecognitionConstructor() {
    return window.SpeechRecognition || window.webkitSpeechRecognition || null;
  }

  function getConfirmButtons(layout) {
    return toArray(layout.querySelectorAll('.quiz-actions button, .quiz-switch button.btn-primary'))
      .filter(function (button) {
        return normalizeText(button.textContent).indexOf('確認答案') !== -1;
      });
  }

  function getSpeechButtons(layout) {
    return toArray(layout.querySelectorAll('.quiz-switch button.btn-primary'))
      .filter(function (button) {
        return !button.closest('.quiz-speech-status') && normalizeText(button.textContent).indexOf('確認答案') === -1;
      });
  }

  function getStudentAnswer(layout) {
    var checked = layout.querySelector('.quiz-options input[type="radio"]:checked');

    if (checked) {
      var label = checked.id ? layout.querySelector('label[for="' + checked.id + '"]') : null;
      return checked.value || (label && label.dataset.optionValue) || (label && normalizeText(label.textContent)) || '';
    }

    var filledInput = toArray(layout.querySelectorAll('.form-control-keyboard'))
      .filter(function (input) {
        return normalizeText(input.value);
      })[0];

    return filledInput ? filledInput.value : '';
  }

  function getStudentAnswerText(layout, fallbackAnswer) {
    var checked = layout.querySelector('.quiz-options input[type="radio"]:checked');

    if (checked) {
      var label = checked.id ? layout.querySelector('label[for="' + checked.id + '"]') : null;
      var image = label ? label.querySelector('img') : null;

      return (label && label.dataset.optionText) ||
        (label && normalizeText(label.textContent)) ||
        (image && normalizeText(image.getAttribute('alt'))) ||
        removeFileExtension((label && label.dataset.optionValue) || checked.value || fallbackAnswer);
    }

    return normalizeText(fallbackAnswer);
  }

  function updateConfirmButtonsState(layout) {
    var hasAnswer = !!normalizeText(getStudentAnswer(layout));
    var isCorrect = layout.dataset.answerResult === 'correct';

    getConfirmButtons(layout).forEach(function (button) {
      button.disabled = isCorrect || !hasAnswer;
    });
  }

  function setLayoutControlsDisabled(layout, disabled) {
    toArray(layout.querySelectorAll('.btn-check, .form-control-keyboard, .quiz-speech-status button')).forEach(function (control) {
      control.disabled = disabled;
    });

    getConfirmButtons(layout).forEach(function (button) {
      button.disabled = disabled;
    });

    getSpeechButtons(layout).forEach(function (button) {
      button.disabled = disabled;
    });
  }

  function resetQuizControls(layout) {
    toArray(layout.querySelectorAll('.btn-check')).forEach(function (input) {
      input.checked = false;
      input.disabled = false;
    });

    toArray(layout.querySelectorAll('.form-control-keyboard')).forEach(function (input) {
      input.value = '';
      input.disabled = false;
    });

    delete layout.dataset.answerResult;
    delete layout.dataset.speechAnswer;
    updateConfirmButtonsState(layout);

    getSpeechButtons(layout).forEach(function (button) {
      button.disabled = false;
      setSpeechButtonState(button, false);
    });

    setSpeechStatus(layout, '');
  }

  function ensureQuizDone(done, section) {
    if (!done) {
      return;
    }

    done.setAttribute('aria-live', 'polite');
    done.setAttribute('aria-hidden', 'true');

    if (done.children[0]) {
      done.children[0].textContent = '你完成了「' + (section.titleZh || '練習') + '」！';
    }
  }

  function updateQuizDone(done, state) {
    if (!done) {
      return;
    }

    if (done.children[1]) {
      done.children[1].textContent = '完成題數：' + state.completedCount;
    }
    if (done.children[2]) {
      done.children[2].textContent = '答對題數：' + state.correctCount;
    }
  }

  function triggerConfetti() {
    var colors = ['#ffc107', '#18b6e3', '#d94b45', '#4c9a35', '#7c509d', '#39a99b'];
    var confetti = document.querySelector('.quiz-confetti');

    if (!confetti) {
      confetti = document.createElement('div');
      confetti.className = 'quiz-confetti';
      confetti.setAttribute('aria-hidden', 'true');
      document.body.appendChild(confetti);
    }

    confetti.textContent = '';

    for (var index = 0; index < 64; index += 1) {
      var piece = document.createElement('span');
      var angle = Math.random() * Math.PI * 2;
      var distance = 120 + Math.random() * 360;
      var x = Math.round(Math.cos(angle) * distance);
      var y = Math.round(Math.sin(angle) * distance);
      var duration = 0.85 + Math.random() * 0.65;
      var delay = Math.random() * 0.08;
      var spin = Math.round(360 + Math.random() * 900);

      piece.className = 'quiz-confetti-piece';
      piece.style.backgroundColor = colors[index % colors.length];
      piece.style.setProperty('--confetti-duration', duration + 's');
      piece.style.setProperty('--confetti-delay', delay + 's');
      piece.style.setProperty('--confetti-x', x + 'px');
      piece.style.setProperty('--confetti-y', y + 'px');
      piece.style.setProperty('--confetti-spin', spin + 'deg');
      confetti.appendChild(piece);
    }

    window.setTimeout(function () {
      confetti.textContent = '';
    }, 1800);
  }

  function showQuestion(state, index) {
    state.currentIndex = index;

    state.layouts.forEach(function (layout, layoutIndex) {
      var isActive = layoutIndex === index;
      layout.style.display = isActive ? '' : 'none';
      layout.dataset.quizActive = isActive ? 'true' : 'false';
    });

    if (state.layouts[index]) {
      updateConfirmButtonsState(state.layouts[index]);
    }

    updateProgress(index + 1, state.questions.length);
    setFeedbackVisible(state.feedback.correct, false);
    setFeedbackVisible(state.feedback.incorrect, false);
    setFeedbackVisible(state.feedback.done, false);
  }

  function showIncorrect(state, studentAnswerText) {
    var message = state.feedback.incorrect ? state.feedback.incorrect.querySelector('[class*="container"] > div:first-child') : null;

    if (message) {
      message.textContent = '再試一次喔！你選的是：「' + (normalizeText(studentAnswerText) || '未作答') + '」，但題目要找的不是這個。';
    }

    setFeedbackVisible(state.feedback.correct, false);
    setFeedbackVisible(state.feedback.incorrect, true);
  }

  function showCorrect(state) {
    var nextButton = state.feedback.correct ? state.feedback.correct.querySelector('button') : null;
    var isLast = state.currentIndex >= state.questions.length - 1;

    if (nextButton) {
      nextButton.innerHTML = (isLast ? '完成' : '下一題') + '<span class="shoe-rotate ms-1"><i class="fa-solid fa-shoe-prints"></i></span>';
      nextButton.disabled = false;
    }

    setFeedbackVisible(state.feedback.incorrect, false);
    setFeedbackVisible(state.feedback.correct, true);
    triggerConfetti();
  }

  function showDone(state) {
    state.layouts.forEach(function (layout) {
      layout.style.display = 'none';
      layout.dataset.quizActive = 'false';
    });

    state.completedCount = state.questions.length;
    updateProgress(state.questions.length, state.questions.length);
    updateQuizDone(state.feedback.done, state);
    setFeedbackVisible(state.feedback.correct, false);
    setFeedbackVisible(state.feedback.incorrect, false);
    setFeedbackVisible(state.feedback.done, true);
  }

  function handleSubmit(state, layout, studentAnswer) {
    studentAnswer = studentAnswer !== undefined ? studentAnswer : getStudentAnswer(layout);

    if (!normalizeText(studentAnswer)) {
      updateConfirmButtonsState(layout);
      return;
    }

    var answer = layout.dataset.answer || '';
    var isCorrect = normalizeAnswer(studentAnswer) === normalizeAnswer(answer);
    var studentAnswerText = getStudentAnswerText(layout, studentAnswer);

    if (!isCorrect) {
      layout.dataset.answerResult = 'incorrect';
      showIncorrect(state, studentAnswerText);
      return;
    }

    if (!state.correctByIndex[state.currentIndex]) {
      state.correctByIndex[state.currentIndex] = true;
      state.completedCount += 1;
      state.correctCount += 1;
    }

    layout.dataset.answerResult = 'correct';
    setLayoutControlsDisabled(layout, true);
    showCorrect(state);
  }

  function setSpeechButtonState(button, isRecording) {
    if (!button) {
      return;
    }

    button.dataset.recording = isRecording ? 'true' : 'false';
    button.setAttribute('aria-pressed', isRecording ? 'true' : 'false');
    button.innerHTML = isRecording
      ? '<i class="fa-solid fa-record-vinyl me-1 text-danger quiz-recording-icon" aria-hidden="true"></i>請按這裡結束錄音'
      : '<i class="fa-solid fa-microphone-lines me-1" aria-hidden="true"></i>請按麥克風，用英文回答';
  }

  function getSpeechStatusParts(layout) {
    var switchElement = layout.querySelector('.quiz-switch');
    var status = switchElement ? switchElement.querySelector('.quiz-speech-status') : null;
    var text;
    var actions;

    if (!status) {
      return null;
    }

    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    text = status.querySelector('.quiz-speech-status-text');
    actions = status.querySelector('.quiz-speech-actions');

    return {
      status: status,
      text: text,
      actions: actions,
      retryButton: actions ? actions.querySelector('.btn-outline-dark') : null,
      submitButton: actions ? actions.querySelector('.btn-primary') : null
    };
  }

  function setSpeechStatus(layout, message, isError, showActions) {
    var parts = getSpeechStatusParts(layout);

    if (!parts) {
      return;
    }

    if (parts.text) {
      parts.text.textContent = message || '';
      parts.text.classList.toggle('text-danger', !!isError);
    }
    if (parts.actions) {
      parts.actions.style.display = showActions ? 'flex' : 'none';
    }
    if (parts.submitButton) {
      parts.submitButton.disabled = !layout.dataset.speechAnswer;
    }
    parts.status.style.display = message ? 'block' : 'none';
  }

  function showSpeechReview(state, layout, button, transcript) {
    var parts = getSpeechStatusParts(layout);
    var cleanTranscript = normalizeText(transcript);

    if (!parts) {
      return;
    }

    layout.dataset.speechAnswer = transcript;
    if (parts.text) {
      parts.text.textContent = '你說的是：「' + cleanTranscript + '」。';
      parts.text.classList.remove('text-danger');
    }
    if (parts.actions) {
      parts.actions.style.display = 'flex';
    }
    if (parts.submitButton) {
      parts.submitButton.disabled = false;
    }
    parts.status.style.display = 'block';
  }

  function startSpeechAnswer(state, layout, button) {
    var Recognition = getSpeechRecognitionConstructor();

    if (!Recognition) {
      delete layout.dataset.speechAnswer;
      setSpeechStatus(layout, '這個瀏覽器不支援語音辨識，請改用鍵盤回答。', true, true);
      return;
    }

    if (state.speech.recognition) {
      state.speech.recognition.stop();
    }

    var recognition = new Recognition();
    var transcript = '';

    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.maxAlternatives = 1;

    state.speech = {
      recognition: recognition,
      layout: layout,
      button: button
    };
    setSpeechButtonState(button, true);
    setSpeechStatus(layout, '');

    recognition.onstart = function () {
      setSpeechButtonState(button, true);
      setSpeechStatus(layout, '');
    };

    recognition.onresult = function (event) {
      transcript = toArray(event.results)
        .map(function (result) {
          return result[0] ? result[0].transcript : '';
        })
        .join(' ');
    };

    recognition.onerror = function () {
      transcript = '';
    };

    recognition.onend = function () {
      setSpeechButtonState(button, false);
      state.speech = {};

      if (!normalizeText(transcript)) {
        delete layout.dataset.speechAnswer;
        setSpeechStatus(layout, '沒有聽到聲音，請再試一次。', true, true);
        return;
      }

      showSpeechReview(state, layout, button, transcript);
    };

    try {
      recognition.start();
    } catch (error) {
      state.speech = {};
      setSpeechButtonState(button, false);
      delete layout.dataset.speechAnswer;
      setSpeechStatus(layout, '沒有聽到聲音，請再試一次。', true, true);
    }
  }

  function stopSpeechAnswer(state, layout, button) {
    if (state.speech.recognition && state.speech.layout === layout) {
      setSpeechStatus(layout, '');
      state.speech.recognition.stop();
      return;
    }

    setSpeechButtonState(button, false);
  }

  function bindSpeechStatusActions(state, layout, button) {
    var parts = getSpeechStatusParts(layout);

    if (!parts) {
      return;
    }

    if (parts.retryButton && !parts.retryButton.dataset.quizSpeechRetryBound) {
      parts.retryButton.dataset.quizSpeechRetryBound = 'true';
      parts.retryButton.addEventListener('click', function () {
        delete layout.dataset.speechAnswer;
        setSpeechStatus(layout, '');
        startSpeechAnswer(state, layout, button);
      });
    }

    if (parts.submitButton && !parts.submitButton.dataset.quizSpeechSubmitBound) {
      parts.submitButton.dataset.quizSpeechSubmitBound = 'true';
      parts.submitButton.addEventListener('click', function () {
        var speechAnswer = layout.dataset.speechAnswer || '';

        if (!normalizeText(speechAnswer)) {
          setSpeechStatus(layout, '沒有聽到聲音，請再試一次。', true, true);
          return;
        }

        handleSubmit(state, layout, speechAnswer);
      });
    }
  }

  function bindSpeechFlow(state, layout) {
    getSpeechButtons(layout).forEach(function (button) {
      setSpeechButtonState(button, false);
      button.setAttribute('type', 'button');

      if (button.dataset.quizSpeechBound) {
        return;
      }

      button.dataset.quizSpeechBound = 'true';
      button.addEventListener('click', function () {
        if (layout.dataset.answerResult === 'correct') {
          return;
        }

        if (button.dataset.recording === 'true') {
          stopSpeechAnswer(state, layout, button);
          return;
        }

        startSpeechAnswer(state, layout, button);
      });

      bindSpeechStatusActions(state, layout, button);
    });
  }

  function bindAnswerFlow(state) {
    state.feedback.correct && state.feedback.correct.setAttribute('role', 'status');
    state.feedback.incorrect && state.feedback.incorrect.setAttribute('role', 'alert');

    state.layouts.forEach(function (layout) {
      resetQuizControls(layout);
      bindSpeechFlow(state, layout);

      getConfirmButtons(layout).forEach(function (button) {
        if (button.dataset.quizSubmitBound) {
          return;
        }

        button.dataset.quizSubmitBound = 'true';
        button.addEventListener('click', function () {
          handleSubmit(state, layout);
          updateConfirmButtonsState(layout);
        });
      });

      toArray(layout.querySelectorAll('.form-control-keyboard')).forEach(function (input) {
        if (!input.dataset.quizInputBound) {
          input.dataset.quizInputBound = 'true';
          input.addEventListener('input', function () {
            updateConfirmButtonsState(layout);
          });
        }

        if (!input.dataset.quizEnterBound) {
          input.dataset.quizEnterBound = 'true';
          input.addEventListener('keydown', function (event) {
            if (event.key === 'Enter') {
              event.preventDefault();

              if (normalizeText(getStudentAnswer(layout))) {
                handleSubmit(state, layout);
              } else {
                updateConfirmButtonsState(layout);
              }
            }
          });
        }
      });
    });

    if (state.feedback.correct) {
      var nextButton = state.feedback.correct.querySelector('button');

      if (nextButton && !nextButton.dataset.quizNextBound) {
        nextButton.dataset.quizNextBound = 'true';
        nextButton.addEventListener('click', function () {
          if (state.currentIndex >= state.questions.length - 1) {
            showDone(state);
            return;
          }

          showQuestion(state, state.currentIndex + 1);
        });
      }
    }
  }

  function initQuizFlow(questions, layouts, section) {
    var state = {
      questions: questions,
      layouts: layouts.slice(0, questions.length),
      section: section,
      feedback: getFeedbackElements(),
      currentIndex: 0,
      completedCount: 0,
      correctCount: 0,
      correctByIndex: {},
      speech: {}
    };

    ensureQuizDone(state.feedback.done, section);
    updateQuizDone(state.feedback.done, state);
    setFeedbackVisible(state.feedback.correct, false);
    setFeedbackVisible(state.feedback.incorrect, false);
    setFeedbackVisible(state.feedback.done, false);
    bindAnswerFlow(state);
    showQuestion(state, 0);
  }

  function renderQuiz(data) {
    var lesson = data.lesson || {};
    var section = data.section || {};
    var questions = data.questions || [];
    var layouts = toArray(document.querySelectorAll('[class*="quiz-layout-"]'));

    questions.forEach(function (question, index) {
      var layout = layouts[index];
      if (!layout) {
        return;
      }

      ensureQuestionData(layout, question, lesson, section);
      updateQuestionNumber(layout, question);
      updatePrompt(layout, question);
      updateAudioButtons(layout, question);
      updateOptions(layout, question);
    });

    initQuizFlow(questions, layouts, section);
  }

  function load(config) {
    return fetch(config.jsonUrl, { cache: 'no-store' })
      .then(function (response) {
        if (!response.ok) {
          throw new Error('無法載入題目 JSON：' + config.jsonUrl);
        }
        return response.json();
      })
      .then(renderQuiz)
      .catch(function (error) {
        console.error(error);
      });
  }

  window.lessonQuizRenderer = {
    load: load
  };
})(window, document);
