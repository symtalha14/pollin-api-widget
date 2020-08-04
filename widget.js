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
        $(".pie_segment").onclick = () => {
            console.log("OO");
        }

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
        pie_chart.css({
            'margin': 'auto'
        });
        var values = [];
        var segments = [];
        var total_parts = 0;
        var total_segments = 0;
        items.map(item => {
            values.push(toDegrees(item.percentage));
        });
        values.sort((a, b) => { return b - a });
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
        total_segments = segments.length;
        var c = 0,
            offset = 0;
        while (total_segments > 0) {
            // segments

            segments[c].map((segment) => {
                // parts
                var segmentDOM = $('<div class="pie_segment"></div>');
                segmentDOM[0].style.setProperty("--bg", color_codes[c]);

                segmentDOM[0].style.setProperty("--offset", offset);
                segmentDOM[0].style.setProperty("--value", segment);
                offset += segment;

                pie_chart.append(segmentDOM[0]);

                console.log(segmentDOM[0]);
            });
            var percentage = $('<span class="percentage">' + values[c] + '%</span>')
            pie_chart.append(percentage);
            c++;
            total_segments--;
        }

        console.log(values, "segmentss", segments, color_codes, total_segments);

    }


    function init({ width, height, border, type, result }) {
        var config = {};
        config['width'] = typeof(width) === 'number' ? (width < 600 ? width : WIDTH) : WIDTH;
        config['height'] = typeof(height) === 'number' ? (height < 400 ? height : HEIGHT) : HEIGHT;
        config['border'] = typeof(border) === 'boolean' ? border : true;
        console.log(config);
        jQuery(document).ready(($) => {
            var loaded = $('[data-widget]')[0] || false;

            if (loaded) {
                var widget = $('[data-widget]');
                widget.css({ 'border': config['border'] ? '1px solid gray' : 'none', 'width': `${config['width']}px`, 'height': `${config['height']}px` });
                var canvas = $('<canvas></canvas>');
                var data = [
                    { 'percentage': 50 },
                    { 'percentage': 30 },
                    { 'percentage': 5 },
                    { 'percentage': 10 },
                    { 'percentage': 5 },


                ]
                toPieChart(data, ['A', 'B', 'C'], 'My Poll', $, 400, 400);

            } else {
                $('body').after("<p>Browser not supported</p>");
            }
        });
    }
    window.myWidget = init;
})();