;(function () {
	'use strict';

	var container = document.querySelector('.clock');
	if (!container) {
		return;
	}

	var targetAttr = container.getAttribute('data-target');
	var targetDate = targetAttr ? new Date(targetAttr) : new Date('2023-10-29T12:00:00+05:30');

	var buildMarkup = function () {
		container.innerHTML = '' +
			'<div class="countdown">' +
				'<div class="countdown-item">' +
					'<span class="countdown-value" data-unit="days">00</span>' +
					'<span class="countdown-label">Днів</span>' +
				'</div>' +
				'<div class="countdown-item">' +
					'<span class="countdown-value" data-unit="hours">00</span>' +
					'<span class="countdown-label">Годин</span>' +
				'</div>' +
				'<div class="countdown-item">' +
					'<span class="countdown-value" data-unit="minutes">00</span>' +
					'<span class="countdown-label">Хвилин</span>' +
				'</div>' +
				'<div class="countdown-item">' +
					'<span class="countdown-value" data-unit="seconds">00</span>' +
					'<span class="countdown-label">Секунд</span>' +
				'</div>' +
			'</div>';
	};

	var pad = function (value) {
		return String(value).padStart(2, '0');
	};

	var pluralizeUk = function (value, forms) {
		var number = Math.abs(value) % 100;
		var lastDigit = number % 10;
		if (number > 10 && number < 20) {
			return forms[2];
		}
		if (lastDigit > 1 && lastDigit < 5) {
			return forms[1];
		}
		if (lastDigit === 1) {
			return forms[0];
		}
		return forms[2];
	};

	var update = function () {
		var now = Date.now();
		var diff = targetDate.getTime() - now;
		if (isNaN(diff) || diff < 0) {
			diff = 0;
		}

		var totalSeconds = Math.floor(diff / 1000);
		var days = Math.floor(totalSeconds / 86400);
		var hours = Math.floor((totalSeconds % 86400) / 3600);
		var minutes = Math.floor((totalSeconds % 3600) / 60);
		var seconds = totalSeconds % 60;

		container.querySelector('[data-unit="days"]').textContent = String(days);
		container.querySelector('[data-unit="hours"]').textContent = pad(hours);
		container.querySelector('[data-unit="minutes"]').textContent = pad(minutes);
		container.querySelector('[data-unit="seconds"]').textContent = pad(seconds);

		container.querySelector('[data-unit="days"] + .countdown-label').textContent =
			pluralizeUk(days, ['День', 'Дні', 'Днів']);
		container.querySelector('[data-unit="hours"] + .countdown-label').textContent =
			pluralizeUk(hours, ['Година', 'Години', 'Годин']);
		container.querySelector('[data-unit="minutes"] + .countdown-label').textContent =
			pluralizeUk(minutes, ['Хвилина', 'Хвилини', 'Хвилин']);
		container.querySelector('[data-unit="seconds"] + .countdown-label').textContent =
			pluralizeUk(seconds, ['Секунда', 'Секунди', 'Секунд']);
	};

	buildMarkup();
	update();
	window.setInterval(update, 1000);
}());
