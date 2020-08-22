(function() {
    const WIDTH = 700;
    const HEIGHT = 500;



    var jQuery;
    if (window.jQuery === undefined || window.jQuery.fn.jquery !== '2.1.3') {
        var script_tag = document.createElement('script');
        var link_tag = document.createElement('link');
        link_tag.setAttribute("rel","stylesheet");
        link_tag.setAttribute("href","https://bit.ly/3j8dyqh");
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
        (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(link_tag);
    } else {

        jQuery = window.jQuery;
        init();
    }


    function scriptLoadHandler() {

        jQuery = window.jQuery.noConflict(true);

    }

    function toPieChart(dataArr, choices, title, $, w, h, total_votes) {
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
        legend.append("<hr>");


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
        var items_arr = [];
        items.map(item => {
            items_arr.push(item.percentage);

            values.push(toDegrees(item.percentage));
        });

        console.log(percentages);
        values.sort((a, b) => { return b - a });
        console.log("Values:", values);
        values.map(value => {
            var parts = [];
            var wholes = Math.floor(value / 90);
            if (value) {

                let ind = values.indexOf(value);
                percentages.push(items.sort((a, b) => {
                    return b["percentage"] - a["percentage"];
                })[ind]['percentage']);
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
            }
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
                console.log("percentage[c]: ", percentages[c]);
                segmentDOM[0].style.setProperty("--percentage", percentages[c].toString().match(/\d+\.\d{1}/)[0]);
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
    var record = undefined;

    function fetchResults($) {
        var data = [];
        var choices = record["choices"]
        var total_votes = choices.reduce((total, elem) => {
            return total + elem[2];
        }, 0);
        var sorted_choices = choices.sort((a, b) => { return b[2] - a[2] });
        console.log("Sorted: ", sorted_choices);
        console.log("Total ", total_votes);
        let choices_arr = Array.prototype.slice.call(sorted_choices).map(ch => {
            data.push({ "percentage": ((ch[2] / total_votes) * 100) });
            return ch[0];
        });

        console.log("Data", data);
        console.log(choices_arr);
        toPieChart(data, choices_arr, record["title"], $, 400, 400, total_votes);

    }

    function initPoll($, config) {
        var widget = $('[data-widget]');
        var selected_choice = "";

        var choices = record['choices'].map(ch => { return ch[0] });
        var title = record["title"];
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
        });

        var submit_btn = $("<button class='submit-btn'>Submit Response</button>");
        submit_btn[0].addEventListener("click", (e) => {
            record["choices"].map(ch => {
                if (ch[0] == selected_choice) {
                    var selected = ch[1];
                    $.ajax({
                        type: "POST",
                        url: "https://www.upoll.in/api/fetch/polls/arb/",
                        data: {
                            'pid': selected,
                        },
                        success: () => {
                            var widget = $("[data-widget]");
                            widget.html("");
                            widget.css({ 'flex-direction': 'row', 'border': config['border'] ? '1px solid gray' : 'none', 'width': `${config['width']}px`, 'height': `${config['height']}px` });
                            var pie = $("<div class='pie'></div>");
                            widget.append(pie);
                            var p = $("<p class='credit-link'></p>");
                            var a = $("<a></a>");
                            a.text(" Pollin");
                            a.attr("href", "https://www.upoll.in");
                            var span = $("<span class='credit-text'></span>");
                            span.text("Powered by");
                            p.append(span, a);

                            widget.append(p);
                            fetchResults($);
                        },
                        dataType: "text"
                    });
                    return;
                }
            })
        });
        choice_List.append(submit_btn);
        widget.append(choice_List);

    }

    function fetchPoll($, eId, type, config) {


        var req = new XMLHttpRequest();
        req.onreadystatechange = () => {
            if (req.status == 200 && req.readyState == 4) {
                record = JSON.parse(req.response);
                type == "result" ? fetchResults($, eId) : initPoll($, config);
                $("[data-widget]").css({ "background": "none" });
            }
        }
        req.open("GET", "https://www.upoll.in/api/fetch/polls/arb/?pxr=" + eId, true);
        req.send();

    }

    function init({ e_id, width, height, border, type, result }) {
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
                    widget.css({ 'border': config['border'] ? '1px solid gray' : 'none', 'width': `${config['width']}px`, 'height': `${config['height']}px`, "position": "relative" });
                    var pie = $("<div class='pie'></div>");
                    widget.append(pie);
                    fetchPoll($, e_id, "result", config);

                } else {
                    widget.css({ 'height': 'fit-content !important', 'align-items': 'start', 'flex-direction': 'column', 'border': config['border'] ? '1px solid gray' : 'none', 'width': `350px`, 'min-height': `300px`, 'position': 'relative', 'margin': 'auto' });
                    fetchPoll($, e_id, "poll", config);


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