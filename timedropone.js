(function($) {
    $.fn.timeDropOne = function(options, callbackFnk) {
        return $(this).each(function() {

            var
                _td_input = $(this),
                _td_input_on = false,
                _td_mobile = false,
                _td_num = function(n) {
                    return n < 10 ? '0' + n : n
                },
                _td_id = $('.td-clock').length,
                _td_alert,
                _td_event = null,
                _td_options = $.extend({

                    format: 'h:mm a',
                    setCurrentTime: true,
                    init_animation: "fadein",
                    primaryColor: "#1977CC",
                    borderColor: "#1977CC",
                    backgroundColor: "#FFF",
                    textColor: '#555',
                    format24Hours: false,
                    earliestTime: null,
                    latestTime: null,
                    minutesIntervalPerHour: 2

                }, options);

            var _td_color = function(col, amt) {

                var usePound = false;

                if (col[0] == "#") {
                    col = col.slice(1);
                    usePound = true;
                }

                var num = parseInt(col, 16);

                var r = (num >> 16) + amt;

                if (r > 255) r = 255;
                else if (r < 0) r = 0;

                var b = ((num >> 8) & 0x00FF) + amt;

                if (b > 255) b = 255;
                else if (b < 0) b = 0;

                var g = (num & 0x0000FF) + amt;

                if (g > 255) g = 255;
                else if (g < 0) g = 0;

                return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16);

            };

            _td_input.prop({
                'readonly': true
            }).addClass('td-input');

            $('body').append('<div class="td-wrap td-n2" id="td-clock-' + _td_id + '"><div class="td-overlay"></div><div class="td-clock td-init"><div class="td-deg td-n"><div class="td-select"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 100 35.4" enable-background="new 0 0 100 35.4" xml:space="preserve"><g><path fill="none" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="M98.1,33C85.4,21.5,68.5,14.5,50,14.5S14.6,21.5,1.9,33"/><line fill="none" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" x1="1.9" y1="33" x2="1.9" y2="28.6"/><line fill="none" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" x1="1.9" y1="33" x2="6.3" y2="33"/><line fill="none" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" x1="98.1" y1="33" x2="93.7" y2="33"/><line fill="none" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" x1="98.1" y1="33" x2="98.1" y2="28.6"/></g></svg></div></div><div class="td-medirian"><span class="td-icon-am td-n">AM</span><span class="td-icon-pm td-n">PM</span></div><div class="td-lancette"><div></div><div></div></div><div class="td-time"><span class="hour"></span>:<span class="minutes"></span></div></div></div>');

            $('head').append('<style>#td-clock-' + _td_id + ' .td-clock {color:' + _td_options.textColor + ';background: ' + _td_options.backgroundColor + '; box-shadow: 0 0 0 1px ' + _td_options.borderColor + ',0 0 0 8px rgba(0, 0, 0, 0.05); } #td-clock-' + _td_id + ' .td-clock .td-time .hour  span.on { color:' + _td_options.primaryColor + '} #td-clock-' + _td_id + ' .td-clock:before { border-color: ' + _td_options.borderColor + '} #td-clock-' + _td_id + ' .td-select:after { box-shadow: 0 0 0 1px ' + _td_options.borderColor + ' } #td-clock-' + _td_id + ' .td-clock:before,#td-clock-' + _td_id + ' .td-select:after {background: ' + _td_options.backgroundColor + ';} #td-clock-' + _td_id + ' .td-lancette {border: 2px solid ' + _td_options.primaryColor + '; opacity:0.1}#td-clock-' + _td_id + ' .td-lancette div:after { background: ' + _td_options.primaryColor + ';} #td-clock-' + _td_id + ' .td-bulletpoint div:after { background:' + _td_options.primaryColor + '; opacity:0.1}</style>');



            var
                _td_container = $('#td-clock-' + _td_id),
                _td_overlay = _td_container.find('.td-overlay'),
                _td_c = _td_container.find('.td-clock');


            _td_c.find('svg').attr('style', "stroke:" + _td_options.borderColor);


            var
                _td_init_deg = -1,
                _td_event_deg = 0,
                _td_wheel_deg = 0,
                _td_h,
                _td_m,
                _td_define_deg = function() {

                    var
                        hour = _td_c.find('.td-time .hour'),
                        minutes = _td_c.find('.td-time .minutes'),
                        h = parseInt(hour.attr('data-id')),
                        m = parseInt(minutes.attr('data-id'));

                    deg = _td_time_to_deg(h,m);
                    

                    _td_init_deg = -1;
                    _td_event_deg = deg;
                    _td_wheel_deg = deg;

                },
                _td_rotation = function(deg) {

                    var hours = _td_c.find('.td-time .hour');
                    var minutes = _td_c.find('.td-time .minutes');

                    var h = _td_deg_to_hour(deg);
                    var m = _td_deg_to_minutes(deg);

                    hours.attr('data-id', _td_num(h)).text(_td_num(h));
                    minutes.attr('data-id', _td_num(m)).text(_td_num(m));
                    
                    _td_wheel_deg = deg;
                    _td_c.find('.td-deg').css('transform', 'rotate(' + (deg) + 'deg)');

                    var minutes_deg = (360 / 60) * m;
                    var hours_deg = (360 / 12) * h;
                    _td_c.find('.td-lancette div:last').css('transform', 'rotate(' + (hours_deg) + 'deg)');
                    _td_c.find('.td-lancette div:first').css('transform', 'rotate(' + (minutes_deg) + 'deg)');

                    var
                        _td_h = _td_c.find('.td-time .hour').attr('data-id'),
                        _td_m = _td_c.find('.td-time .minutes').attr('data-id');

                    var
                        str =
                        _td_options.format
                        .replace(/\b(H)\b/g, Math.round(_td_h))
                        .replace(/\b(h)\b/g, Math.round(h))
                        .replace(/\b(m)\b/g, Math.round(_td_m))
                        .replace(/\b(HH)\b/g, _td_num(Math.round(_td_h)))
                        .replace(/\b(hh)\b/g, _td_num(Math.round(h)))
                        .replace(/\b(mm)\b/g, _td_num(Math.round(_td_m)))

                        if(_td_options.format24Hours) {
                            str = str
                            .replace(/\b(a)\b/g, "")
                            .replace(/\b(A)\b/g, "")
                        } else {
                            str = str
                            .replace(/\b(a)\b/g, a)
                            .replace(/\b(A)\b/g, A);
                        }
                        
                    _td_input.val(str);
                },
                _td_check_time_range = function() {
                    var
                        _td_h = _td_c.find('.td-time .hour').attr('data-id'),
                        _td_m = _td_c.find('.td-time .minutes').attr('data-id');

                    _td_set_time_in_range(_td_h, _td_m);
                },
                _td_time_to_deg = function(hour, minutes) {
                    var total_minutes = minutes + hour * 60;
                    var total_intervals = total_minutes / _td_minutes_per_interval();
                    var deg = total_intervals * _td_deg_per_interval();
                    return deg;
                },
                _td_deg_per_interval = function() {
                    return (360 /(24 * _td_options.minutesIntervalPerHour));
                },
                _td_minutes_per_interval = function() {
                    return 60 / _td_options.minutesIntervalPerHour;
                },
                _td_deg_to_hour = function(deg) {
                    var intervals = Math.floor(deg / _td_deg_per_interval());
                    var hours = intervals / _td_options.minutesIntervalPerHour;
                    return Math.floor(hours);
                },
                _td_deg_to_minutes = function(deg) {
                    var intervals = Math.floor(deg / _td_deg_per_interval());
                    var minutes = (intervals % _td_options.minutesIntervalPerHour) * _td_minutes_per_interval();
                    return Math.floor(minutes);
                }
                _td_set_time_in_range = function(hour, minutes) {
                    // check time validity
                    if(hour && minutes && parseInt(hour) >= 0 && parseInt(hour) <= 23 &&  parseInt(minutes) >= 0 &&  parseInt(minutes) <= 59) {
                        hour = parseInt(hour);
                        m = parseInt(minutes);

                        if(_td_options.earliestTime){
                            var earliestHour = parseInt(_td_options.earliestTime.split(":")[0]);
                            var earliestMinute = parseInt(_td_options.earliestTime.split(":")[1]);

                            if(hour < earliestHour){
                                hour = earliestHour;
                                m = earliestMinute;
                            } else {
                                if(hour == earliestHour && m < earliestMinute) {
                                    m = earliestMinute;
                                }
                            }
                        }

                        if(_td_options.latestTime){
                            var latestHour = parseInt(_td_options.latestTime.split(":")[0]);
                            var latestMinute = parseInt(_td_options.latestTime.split(":")[1]);

                            if(hour > latestHour){
                                hour = latestHour;
                                m = latestMinute;
                            } else {
                                if(hour == latestHour && m > latestMinute) {
                                    m = latestMinute;
                                }
                            }
                        }

                        _td_set_time(hour, m);
                    }
                },
                _td_merdian_hour = function(h){
                    if (h >= 12 && h < 24) {
                        return h - 12;
                    } else {
                        return h;
                    }    
                },
                _td_set_time = function(h, m) {
                    var
                    _td_span_h = _td_c.find('.td-time .hour'),
                    _td_span_m = _td_c.find('.td-time .minutes'),
                    hour, minutes;

                    hour = h;
                    minutes = m;

                    if(_td_options.meridians)
                        hour = _td_merdian_hour(hour);

                    if(h < 10)
                        hour = "0" + h;

                    if(m < 10)
                        minutes = "0" + m;

                    _td_span_h.attr('data-id', h).text(hour);
                    _td_span_m.attr('data-id', m).text(minutes);

                    _td_event_deg = _td_time_to_deg(h, m);

                    _td_rotation(_td_event_deg);
                    _td_wheel_deg = _td_event_deg;
                    _td_init_deg = -1;
                };


            if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                _td_mobile = true;
            }

            _td_c.find('.td-time').on('click', function(e) {

                var hour = $(".hour");
                var minutes = $(".minutes");

                var h = parseInt(hour.attr('data-id'));
                var m = parseInt(minutes.attr('data-id'));

                deg = _td_time_to_deg(h,m);

                _td_init_deg = -1;
                _td_event_deg = deg;
                _td_wheel_deg = deg;
                _td_rotation(deg);

            });

            _td_c.find('.td-deg').on('touchstart mousedown', function(e) {

                _td_define_deg();

                e.preventDefault();

                clearInterval(_td_alert);

                _td_c.find('.td-deg').removeClass('td-n');
                _td_c.find('.td-select').removeClass('td-rubber');

                _td_input_on = true;

                var offset = _td_c.offset();
                var center = {
                    y: offset.top + _td_c.height() / 2,
                    x: offset.left + _td_c.width() / 2
                };

                var a, b, deg, tmp, rad2deg = 180 / Math.PI;

                _td_c.removeClass('td-rubber');

                $(window).on('touchmove mousemove', function(e) {

                    if (_td_input_on == true) {

                        if (_td_mobile) move = e.originalEvent.touches[0];
                        else move = e;

                        a = center.y - move.pageY;
                        b = center.x - move.pageX;
                        deg = Math.atan2(a, b) * rad2deg;

                        if (deg < 0)
                            deg = 360 + deg;

                        if (_td_init_deg == -1)
                            _td_init_deg = deg;

                        tmp = Math.floor((deg - _td_init_deg) + _td_event_deg);

                        if (tmp < 0) tmp = 360 + tmp;
                        else if (tmp > 360) tmp = tmp % 360;

                        _td_rotation(tmp);

                    }

                });

            });

            $(document).on('touchend mouseup', function() {
                if (_td_input_on) {

                    _td_input_on = false;

                    _td_c.find('.td-deg').addClass('td-n');
                    _td_c.find('.td-select').addClass('td-rubber');

                    if(_td_options.earliestTime || _td_options.latestTime)
                        _td_check_time_range();

                }

            });

            var _td_init = function(value) {

                var
                    d = new Date(),
                    _td_span_h = _td_c.find('.td-time .hour'),
                    _td_span_m = _td_c.find('.td-time .minutes'),
                    h,
                    m;

                if (_td_input.val().length && !_td_options.setCurrentTime) {

                    var reg = /\d+/g,
                        am;
                    var st = _td_input.val().split(':');

                    if (st) {

                        h = st[0].match(reg);
                        m = st[1].match(reg);
                        if (_td_input.val().indexOf("am") != -1 || _td_input.val().indexOf("AM") != -1 || _td_input.val().indexOf("pm") != -1 || _td_input.val().indexOf("PM") != -1) {
                            if (_td_input.val().indexOf("am") != -1 || _td_input.val().indexOf("AM") != -1) am = true;
                            else am = false;

                            if (!am) {
                                if (h < 13) {
                                    h = parseInt(h) + 12;
                                    if (h == 24) h = 0;
                                }
                            } else if (h == 12) h = 0;
                        } else if (h == 24) h = 0;
                    } else {

                        if (!parseInt(_td_span_h.text())) h = _td_num(d.getHours());
                        else h = _td_num(_td_span_h.text());
                        if (!parseInt(_td_span_m.text())) m = _td_num(d.getMinutes());
                        else m = _td_num(_td_span_m.text());

                    }

                } else {

                    if (!parseInt(_td_span_h.text())) h = _td_num(d.getHours());
                    else h = _td_num(_td_span_h.text());
                    if (!parseInt(_td_span_m.text())) m = _td_num(d.getMinutes());
                    else m = _td_num(_td_span_m.text());

                }

                _td_set_time_in_range(h,m);

            }

            _td_init();

            _td_input.focus(function(e) {
                e.preventDefault();
                _td_input.blur();
            });

            _td_input.click(function(e) {

                clearInterval(_td_event);

                _td_container.removeClass('td-fadeout');
                _td_container.addClass('td-show').addClass('td-' + _td_options.init_animation);
                _td_c.css({
                    'top': (_td_input.offset().top + (_td_input.outerHeight() - 8)),
                    'left': (_td_input.offset().left + (_td_input.outerWidth() / 2)) - (_td_c.outerWidth() / 2)
                });

                if (_td_c.hasClass('td-init')) {

                    _td_alert = setInterval(function() {
                        _td_c.find('.td-select').addClass('td-alert');
                        setTimeout(function() {
                            _td_c.find('.td-select').removeClass('td-alert');
                        }, 1000);
                    }, 2000);

                    _td_c.removeClass('td-init');

                }

            });
            _td_overlay.click(function() {

                _td_container.addClass('td-fadeout').removeClass('td-' + _td_options.init_animation);
                _td_event = setTimeout(function() {
                    _td_container.removeClass('td-show')
                }, 300);

            });
            $(window).on('resize', function() {

                _td_define_deg();
                _td_c.css({
                    'top': (_td_input.offset().top + (_td_input.outerHeight() - 8)),
                    'left': (_td_input.offset().left + (_td_input.outerWidth() / 2)) - (_td_c.outerWidth() / 2)
                });
            });

        });
    };
}(jQuery));