(function(){

    // UserMedia

    var userMedia = undefined;
    navigator.getUserMedia = navigator.getUserMedia
    || navigator.webkitGetUserMedia
    || navigator.mozGetUserMedia
    || navigator.msGetUserMedia;


    if(!navigator.getUserMedia){
        console.error("No getUserMedia Support in this Browser");
    }

    navigator.getUserMedia({
        audio:true
    }, function(stream){
        userMedia = stream;
    }, function(error){
        console.error("Could not get User Media: " + error);
    });

    // State

    var isRecording = false;

    // Selectors

    var $content = $('#content');
    var $url = $('#url');
    var $appKey = $('#app_key');
    var $appId = $('#app_id');
    var $userId = $('#user_id');
    var $nluTag = $('#nlu_tag');
    var $language = $('#language');
    var $saveCreds = $("#save_creds");
    var $resetCreds = $("#reset_creds");
    var $useNlu = $("#use_nlu");
    var $ttsGo = $('#tts_go');
    var $ttsText = $('#tts_text');
    var $ttsDebug = $('#tts_debug_output');
    var $asrRecord = $('#asr_go');
    var $asrLabel = $('#asr_label');
    var $nluExecute = $('#nlu_go');
    var $asrViz = $('#asr_viz');
    var $asrDebug = $('#asr_debug_output');
    var $nluDebug = $('#nlu_debug_output');
    var $asrVizCtx = $asrViz.get()[0].getContext('2d');
    var $showHideToggle = $('#show-hide-credentials');

    $showHideToggle.on('click', function(){
        var cv = $("#credentials-view");
        if(cv.is(':visible')){
            $(this).text('Show');
        } else {
            $(this).text('Hide');
        }
        cv.toggle();
    });

    // Default options for all transactions

    var defaultOptions = {
        onopen: function() {
            console.log("Websocket Opened");
            $content.addClass('connected');
        },
        onclose: function() {
            console.log("Websocket Closed");
            $content.removeClass('connected');
        },
        onvolume: function(vol) {
            viz(vol);
        },
        onresult: function(msg) {
            // console.log(msg);
            if (msg.result_type == "NMDP_TTS_CMD") {
                dLog(JSON.stringify(msg, null, 2), $ttsDebug);
            } else if (msg.result_type == "NVC_ASR_CMD") {
                dLog(JSON.stringify(msg, null, 2), $asrDebug);
            } else if (msg.result_type == "NDSP_ASR_APP_CMD") {
                if(msg.result_format == "nlu_interpretation_results") {
                    try{
                        dLog(JSON.stringify(msg.nlu_interpretation_results.payload.interpretations, null, 2), $asrDebug);
                        var res = msg.nlu_interpretation_results.payload.interpretations;
                        var intent = msg.nlu_interpretation_results.payload.interpretations[0].action.intent.value;
                        console.log(intent);
                        console.log(res);

                        switch(intent) {
                            case "WEATHER":
                                console.log("oh hey u requested weather");
                                break;
                            case "TodoList":
                                console.log("wat to do");
                                break;
                            case "MUSIC":
                                console.log("play tunes");
                                break;
                            default:
                                throw "invalid intent";
                        }

                    }catch(ex){
                        dLog(JSON.stringify(msg, null, 2), $asrDebug, true);
                    }
                } else {
                    dLog(JSON.stringify(msg, null, 2), $asrDebug);
                }
            } else if (msg.result_type === "NDSP_APP_CMD") {
                if(msg.result_format == "nlu_interpretation_results") {
                    try{
                        dLog(JSON.stringify(msg.nlu_interpretation_results.payload.interpretations, null, 2), $nluDebug);
                    }catch(ex){
                        dLog(JSON.stringify(msg, null, 2), $nluDebug, true);
                    }
                } else {
                    dLog(JSON.stringify(msg, null, 2), $nluDebug);
                }
            }
        },
        onerror: function(error) {
            console.error(error);
            $content.removeClass('connected');
        }
    };

    function createOptions(overrides) {
        var options = Object.assign(overrides, defaultOptions);
        options.appId = $appId.val();
        options.appKey = $appKey.val();
        options.userId = $userId.val();
        options.url = $url.val()
        return options;
    }

    // Text NLU

    function textNlu(evt){
        var options = createOptions({
            text: $("#nlu_text").val(),
            tag: $nluTag.val(),
            language: $language.val()
        });
        Nuance.startTextNLU(options);
    }
    $nluExecute.on('click', textNlu);

    // ASR / NLU

    function asr(evt){
        if(isRecording) {
            Nuance.stopASR();
            $asrLabel.text('RECORD');
        } else {
            cleanViz();
            var options = createOptions({
                userMedia: userMedia,
                language: $language.val()
            });

            if($useNlu.prop('checked')) {
                options.nlu = true;
                options.tag = $nluTag.val();
            }
            Nuance.startASR(options);
            $asrLabel.text('STOP RECORDING');
        }
        isRecording = !isRecording;
    }
    $asrRecord.on('click', asr);

    // TTS

    function tts(evt){
        var options = createOptions({
            language: $language.val(),
            voice: TTS_VOICE,
            text: $ttsText.val()
        });
        Nuance.playTTS(options);
    }
    $ttsGo.on('click', tts);

    // ASR volume visualization

    window.requestAnimFrame = (function(){
        return  window.requestAnimationFrame       ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame    ||
                function(callback, element){
                    window.setTimeout(callback, 1000 / 60);
                };
    })();

    var asrVizData = {};
    function cleanViz(){
        var parentWidth = $asrViz.parent().width();
        $asrViz[0].getContext('2d').canvas.width = parentWidth;
        asrVizData = {
            w: parentWidth,
            h: 256,
            col: 0,
            tickWidth: 0.5
        };
        var w = asrVizData.w, h = asrVizData.h;
        $asrVizCtx.clearRect(0, 0, w, h); // TODO: pull out height/width
        $asrVizCtx.strokeStyle = '#333';
        var y = (h/2) + 0.5;
        $asrVizCtx.moveTo(0,y);
        $asrVizCtx.lineTo(w-1,y);
        $asrVizCtx.stroke();
        asrVizData.col = 0;
    }

    function viz(amplitudeArray){
        var h = asrVizData.h;
        requestAnimFrame(function(){
            // Drawing the Time Domain onto the Canvas element
            var min = 999999;
            var max = 0;
            for(var i=0; i<amplitudeArray.length; i++){
                var val = amplitudeArray[i]/asrVizData.h;
                if(val>max){
                    max=val;
                } else if(val<min){
                    min=val;
                }
            }
            var yLow = h - (h*min) - 1;
            var yHigh = h - (h*max) - 1;
            $asrVizCtx.fillStyle = '#6d8f52';
            $asrVizCtx.fillRect(asrVizData.col,yLow,asrVizData.tickWidth,yHigh-yLow);
            asrVizData.col += 1;
            if(asrVizData.col>=asrVizData.w){
                asrVizData.col = 0;
                cleanViz();
            }
        });
    }
    cleanViz();


    // Helpers

    function setCredentialFields() {
        $url.val(localStorage.getItem("url") || URL || '');
        $appId.val(localStorage.getItem("app_id") || APP_ID || '');
        $appKey.val(localStorage.getItem("app_key") || APP_KEY || '');
        $userId.val(localStorage.getItem("user_id") || USER_ID || '');
        $nluTag.val(localStorage.getItem("nlu_tag") || NLU_TAG ||  '');
        $language.val(localStorage.getItem("language") || ASR_LANGUAGE || 'eng-USA');
    }
    setCredentialFields();

    $saveCreds.on('click', function() {
        localStorage.setItem("url", $url.val());
        localStorage.setItem("app_id", $appId.val());
        localStorage.setItem("app_key", $appKey.val());
        localStorage.setItem("user_id", $userId.val());
        localStorage.setItem("nlu_tag", $nluTag.val());
        localStorage.setItem("language", $language.val());
    });
    $resetCreds.on('click', function() {
        localStorage.setItem("url", URL);
        localStorage.setItem("app_id", APP_ID);
        localStorage.setItem("app_key", APP_KEY);
        localStorage.setItem("user_id", USER_ID);
        localStorage.setItem("nlu_tag", NLU_TAG);
        localStorage.setItem("language", ASR_LANGUAGE);
        setCredentialFields();
    });

    var dLog = function dLog(msg, logger, failure){
        var d = new Date();
        //logger.prepend('<div style="color:'+(!failure?"#090":"#900")+';"><strong>'+(!failure?'OK':'Failed')+'</strong> <em>'+d.toISOString()+'</em> &nbsp; <pre>'+msg+'</pre></div>');
    };

})();
