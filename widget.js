(function() {
    const WIDTH = 700;
    const HEIGHT = 500;



    var jQuery;
    if (window.jQuery === undefined || window.jQuery.fn.jquery !== '2.1.3') {
        var script_tag = document.createElement('script');
        script_tag.setAttribute("type", "text/javascript");
        script_tag.setAttribute("src",
            "http://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js");
        if (script_tag.readyState) {
            script_tag.onreadystatechange = function() { // For old versions of IE
                if (this.readyState == 'complete' || this.readyState == 'loaded') {
                    scriptLoadHandler();
                }
            };
        } else {
            script_tag.onload = scriptLoadHandler;
        }
        // window.jQuery = "1.4.2";

        (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(script_tag);
    } else {

        jQuery = window.jQuery;
        init();
    }


    function scriptLoadHandler() {

        jQuery = window.jQuery.noConflict(true);

    }

    function toPieChart(dataArr, choices, title, $, w, h) {
        var items = dataArr;
        var color_codes_legend = [];
        var color_codes = [];
        var percentages = [];
        var widget = $("[data-widget]");
        var legend = $("<div class='legend'></div>");
        var choices_list = $('<ul class="legend"></ul>');
        var span_title = $("<p class='title'></p>");
        span_title.text(title);
        legend.append(span_title);
        legend.append("<hr></hr>");


        function toDegrees(percentage) {
            return percentage * (360 / 100);
        }
        var cache_color = 'ffffff';

        function randomColor() {
            var color = [];
            for (var j = 0; j < 3; j++) {
                var r = Math.floor(Math.random() * 255);
                color.push(r);
            }

            if (color[0] == cache_color[0]) {
                randomColor();
            } else {
                cache_color = color;
                var rgbC = 'rgba(' + color[0] + ',' + color[1] + ',' + color[2] + ',1.0)';
                return rgbC;
            }
        }

        var prevColor = '';
        var pie_chart = $(".pie");

        var values = [];
        var segments = [];
        var total_parts = 0;
        var total_segments = 0;
        items.map(item => {
            percentages.push(item.percentage);
            values.push(toDegrees(item.percentage));
        });
        console.log(percentages);
        values.sort((a, b) => { return b - a });
        console.log("Values:", values);
        values.map(value => {
            var parts = [];
            var wholes = Math.floor(value / 90);

            while (wholes > 0) {
                parts.push(90);
                wholes--;
            }
            if ((value % 90) != 0) {
                parts.push(value % 90);
            }
            segments.push(parts);
            total_parts += parts.length;
            var color = randomColor();
            color_codes.push(color);
        });
        console.log(choices);
        choices.map((choice, index) => {
            var li = $("<li></li>");
            var span_color = $("<span class='color_box'></span>");
            span_color.css({ "background": color_codes[index] });
            li.append(span_color, choice);
            choices_list.append(li);
        });
        legend.append(choices_list);
        widget.append(legend);
        console.log("Segments: ", segments);
        //    segments.sort((a, b) => { return a - b; });
        total_segments = segments.length;
        var c = 0,
            offset = 0;
        console.log(total_segments, segments.length);
        var temp = null;
        while (total_segments > 0) {
            // segments


            segments[c].map((segment) => {
                // parts
                var segmentDOM = $('<div class="pie_segment"></div>');
                segmentDOM[0].style.setProperty("--bg", color_codes[c]);

                // var percentage = $('<span class="percentage">' + items[c].percentage + '%</span>');

                segmentDOM[0].style.setProperty("--offset", offset);
                segmentDOM[0].style.setProperty("--value", segment);
                segmentDOM[0].style.setProperty("--percentage", percentages[c]);
                offset += segment;
                segmentDOM[0].addEventListener("click", (e) => {
                    console.log(c);
                    $(".percentage").text(segmentDOM[0].style.getPropertyValue("--percentage") + "%");
                    $(".percentage").css({
                        "display": "block",
                        "top": e.clientY + 'px',
                        "left": e.clientX + 'px'
                    });
                });
                segmentDOM[0].addEventListener("mouseover", (e) => {
                    console.log(c);
                    $(".percentage").text(segmentDOM[0].style.getPropertyValue("--percentage") + "%");
                    $(".percentage").css({
                        "display": "block",
                        "top": e.clientY + 'px',
                        "left": e.clientX + 'px'
                    });
                });
                if (c == 0) {

                    pie_chart.append(segmentDOM[0]);

                } else {
                    var incomplete_chart = document.querySelector(".pie");
                    incomplete_chart.insertBefore(segmentDOM[0], incomplete_chart.childNodes[0]);

                }
                console.log(segmentDOM[0]);
            });
            c++;
            total_segments--;
        }

        console.log(values, "segmentss", segments, color_codes, total_segments);

    }

    function fetchResults($) {
        var data = [
            { 'percentage': 35 },
            { 'percentage': 25 },
            { 'percentage': 20 },
            { 'percentage': 20 }

        ]
        toPieChart(data, ['Washing hands regularly after every activity.', 'Going out in the crtoewads', 'C', 'D'], 'What measures are you taking against the Coronavirus?', $, 400, 400);
    }

    function fetchPoll($) {
        var widget = $('[data-widget]');
        var selected_choice = "";
        var choices = ['sdfg', 'asdfm', 'Washing hands regularly after every activity.', 'Going out in the crtoewads', 'C', 'D'];
        var title = 'What measures are you taking against the Coronavirus?';
        var span_title = $("<p class='title-2'></p>");
        span_title.text(title);
        widget.append(span_title);
        widget.append("<hr>")
        var choice_List = $("<ul class='list-group list-grid'></ul>");
        choices.map(choice => {
            var li = $("<li></li>");
            li[0].addEventListener("click", (e) => {
                Array.prototype.slice.call(choice_List.children()).map(ch => {
                    if (ch.style.color == "darkblue") {
                        ch.style.color = "black";
                        ch.style.fontWeight = "normal";
                    }

                });
                li[0].style.color = "darkblue";
                li[0].style.fontWeight = "bold";
                selected_choice = li[0].innerText;
                console.log(selected_choice);
            });
            li.text(choice);
            choice_List.append(li);
        })
        var submit_btn = $("<button class='submit-btn'>Submit Response</button>");

        choice_List.append(submit_btn);
        widget.append(choice_List);
    }

    function init({ width, height, border, type, result }) {
        var config = {};
        config['width'] = typeof(width) === 'number' ? (width < 600 ? width : WIDTH) : WIDTH;
        config['height'] = typeof(height) === 'number' ? (height < 400 ? height : HEIGHT) : HEIGHT;
        config['border'] = typeof(border) === 'boolean' ? border : true;
        console.log(config);
        if (jQuery == undefined) {
            var span = document.createElement("span");
            span.className = "info-text";
            span.innerText = "No Internet Connection";
            document.querySelector("[data-widget]").append(span);
        }
        jQuery(document).ready(($) => {
            var loaded = $('[data-widget]')[0] || false;

            if (loaded) {
                var widget = $('[data-widget]');
                widget.html("");
                if (type == 'result') {
                    widget.css({ 'border': config['border'] ? '1px solid gray' : 'none', 'width': `${config['width']}px`, 'height': `${config['height']}px` });
                    var pie = $("<div class='pie'></div>");
                    widget.append(pie);
                    fetchResults($);
                } else {
                    widget.css({ 'height': 'max-content !important', 'align-items': 'start', 'flex-direction': 'column', 'border': config['border'] ? '1px solid gray' : 'none', 'width': `350px`, 'height': `fit-content`, 'position': 'relative', 'margin': 'auto' });
                    fetchPoll($);
                }
                var p = $("<p class='credit-link'></p>");
                var a = $("<a></a>");
                a.text(" Pollin");
                a.attr("href", "https://www.upoll.in");
                var span = $("<span class='credit-text'></span>");
                span.text("Powered by");
                p.append(span, a);
                widget.append(p);

            } else {
                $('body').after("<p>Browser not supported</p>");
            }
        });
    }
    window.myWidget = init;
})();