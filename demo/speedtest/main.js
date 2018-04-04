$(function() {

    var module; // Current Network.js' module

    /*
     * Tooltips
     */

    $('.btn-group').tooltip();

    /*
     * UI
     */

    var UI = {
        $btnStart: $('[data-measure]'),
        $btnAbort: $('[data-abort]'),
        $output: $('output'),
        $btnClear: $('[data-clear]'),
        $btnAjax: $('[data-ajax]'),
        clear: function() {
            UI.$output.empty();
            progressBarOne.reset();
        },

        start: function() {
            rawModule = $(this).data('measure');
            module = rawModule.charAt(0).toUpperCase() + rawModule.slice(1);

            UI.$btnStart.prop('disabled', true);
            UI.$btnAbort.prop('disabled', false);

            net[rawModule].start();

            // The latency module doesn't have a start event, we must trigger it manually.
            if (rawModule == 'latency') {
                //net[rawModule].trigger('start');
            }
        },

        restart: function(size) {
            // UI.notice(UI.delimiter(
            //     'The minimum delay of ' + UI.value(downloadTimeDelayMax, 'milliseconds') + ' has not been reached'
            // ));

            // UI.notice(UI.delimiter(
            //     'Restarting measures with '
            //     + UI.value(size / 1024 / 1024, 'MB')
            //     + ' of data...'
            // ));

        },

        stop: function() {
            //UI.notice(UI.delimiter('Finished measures'));
            UI.$btnStart.prop('disabled', false);
            UI.$btnAbort.prop('disabled', true);
        },

        abort: function() {
            net.download.abort();
        },

        notice: function(text, newSection) {
            var $o = UI.$output,
                stickToBottom = ($o.scrollTop() + $o.outerHeight()) == $o.prop('scrollHeight');

            $o.append('<br>');
            newSection && $o.append('<br>');

            $o.append('<span class="yellow">[' + module + ']</span> ' + text);

            if (stickToBottom) {
                $o.scrollTop($o.prop('scrollHeight'));
            }
        },

        value: function(value, unit) {
            if (value != null) {
                return '<span class="blue">' + value.toFixed(3) + ' ' + unit + '</span>';
            } else {
                return '<span class="blue">null</span>';
            }
        },

        delimiter: function(text) {
            return '<span class="green">' + text + '</span>';
        },
        ajax: function() {
            console.log("abc");
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open("GET", "1M.txt?" + Math.random());
            xmlhttp.onreadystatechange = function() {
                console.log(xmlhttp.readyState);
                var arrayBuffer = xmlhttp.response;
                //console.log(arrayBuffer);
                //console.log(xmlhttp.readyState,xmlhttp.status,XMLHttpRequest.DONE,xmlhttp.responseText,xmlhttp.response)
            }
            xmlhttp.onload = function() {

            }
            xmlhttp.onprogress = function(e) {
                console.log(e);
                console.log(e.loaded);

            };
            xmlhttp.responseType = "arraybuffer";
            xmlhttp.send();
        }

    };

    /*
     * Network.js configuration
     */

    var net = window.net = new Network();

    var fileSize = 2 * 1024 * 1024; // 1M
    var bitRateMin = 400 * 1024; // 400K
    window.requestCount = 0;

    var downloadTimeDelayMax = Math.ceil((fileSize / bitRateMin));

    console.log(downloadTimeDelayMax);

    net.download.settings({
        endpoint: '1M.txt',
        delay: downloadTimeDelayMax * 1000, // 毫秒

        measures: 3,
        attempts: 2,
        data: {
            size: 1048576,
            multiplier: 1
        }
    });
    //console.log(net.settings());

    function start(size) {

        progressBarOne.start();
        // UI.notice(UI.delimiter(
        //     'Starting ' + rawModule + ' measures'
        //     + (rawModule != 'latency' ? (' with ' + UI.value(size / 1024 / 1024, 'MB') + ' of data') : '')
        //     + '...'
        // ), true);
    }

    function progress(avg, instant) {
        // if(requestCount>10){
        //     net.download.abort();
        //     requestCount = 0;
        //     return;
        // }

        // var output = 'Instant speed: ' + UI.value(instant / 1024 / 1024, 'MBps');
        //     output += ' // Average speed: ' + UI.value(avg / 1024 / 1024, 'MBps');

        // UI.notice(output);
        // requestCount++;
    }

    function end(avg) {
        UI.notice('speed: ' + UI.value(avg / 1024 / 1024, 'MBps'));
        UI.stop();
        progressBarOne.end();
    }

    net.download.on('start', start).on('progress', progress).on('restart', UI.restart).on('end', end);


    /*
     * Bindings
     */

    UI.$btnStart.on('click', UI.start);
    UI.$btnAbort.on('click', UI.abort);
    UI.$btnClear.on('click', UI.clear);
    UI.$btnAjax.on('click', UI.ajax);



    window.progressBarOne = new processBarComponent({
        initValue: 1,
        elem: $(".progress-bar"),
    });


    /*
    var progressBar=$(".progress-bar")
    var step=1;
    var setIntervalId ;
    function jindu(){
        
        
        if(step<100){
            step++
            if(step>=100){
                step = 100;
            }
            progressBar.css({"width":step+"%"}).children("span").text(step+'%');
        } else {
            clearInterval(setIntervalId);
        }
    }
    setIntervalId = setInterval(jindu,100)
    */

});

function processBarComponent(settings) {
    var settingsDefault = {
        elem: $(".progress-bar"),
        initValue: 0,
        step: 20,
        isProcessing: 0,
        setIntervalId: null
    }
    $.extend(this, settingsDefault, settings);
    this.currValue = this.initValue

};

processBarComponent.prototype = {
    reset: function() {
        this.currValue = this.initValue || 0;
        this.setUI(0);
        //this.setUI(this.currValue);
    },
    setUI: function(currValue) {
        //console.log("set ui:"+currValue)
        this.elem.css({ "width": currValue + "%" }).children("span").text(currValue + '%');
    },
    start: function() {
        var _this = this;
        this.reset();
        var currValue = _this.currValue;
        var step = _this.step;

        function jindu() {
            if (currValue < 100) {
                currValue = currValue + Math.floor(Math.random() * step + 1)
                if (currValue >= 100) {
                    currValue = 100;
                    net.download.abort();
                }
                _this.setUI(currValue);
            } else {
                _this.end();
            }
            _this.currValue = currValue;
        }

        function finish() {

        }

        _this.setIntervalId = setInterval(jindu, 200)
    },
    end: function() {
        var _this = this;
        _this.setIntervalId && clearInterval(_this.setIntervalId);
    }


}