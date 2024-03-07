(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.assemblyai = {}));
})(this, (function (exports) { 'use strict';

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise, SuppressedError, Symbol */


    function __rest(s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }

    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
        var e = new Error(message);
        return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
    };

    /**
     * Base class for services that communicate with the API.
     */
    class BaseService {
        /**
         * Create a new service.
         * @param params The parameters to use for the service.
         */
        constructor(params) {
            this.params = params;
        }
        fetch(input, init) {
            var _a;
            return __awaiter(this, void 0, void 0, function* () {
                init = init !== null && init !== void 0 ? init : {};
                init.headers = (_a = init.headers) !== null && _a !== void 0 ? _a : {};
                init.headers = Object.assign({ Authorization: this.params.apiKey, "Content-Type": "application/json" }, init.headers);
                if (!input.startsWith("http"))
                    input = this.params.baseUrl + input;
                const response = yield fetch(input, init);
                if (response.status >= 400) {
                    let json;
                    const text = yield response.text();
                    if (text) {
                        try {
                            json = JSON.parse(text);
                        }
                        catch (_b) {
                            /* empty */
                        }
                        if (json === null || json === void 0 ? void 0 : json.error)
                            throw new Error(json.error);
                        throw new Error(text);
                    }
                    throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
                }
                return response;
            });
        }
        fetchJson(input, init) {
            return __awaiter(this, void 0, void 0, function* () {
                const response = yield this.fetch(input, init);
                return response.json();
            });
        }
    }

    class LemurService extends BaseService {
        summary(params) {
            return this.fetchJson("/lemur/v3/generate/summary", {
                method: "POST",
                body: JSON.stringify(params),
            });
        }
        questionAnswer(params) {
            return this.fetchJson("/lemur/v3/generate/question-answer", {
                method: "POST",
                body: JSON.stringify(params),
            });
        }
        actionItems(params) {
            return this.fetchJson("/lemur/v3/generate/action-items", {
                method: "POST",
                body: JSON.stringify(params),
            });
        }
        task(params) {
            return this.fetchJson("/lemur/v3/generate/task", {
                method: "POST",
                body: JSON.stringify(params),
            });
        }
        /**
         * Delete the data for a previously submitted LeMUR request.
         * @param id ID of the LeMUR request
         */
        purgeRequestData(id) {
            return this.fetchJson(`/lemur/v3/${id}`, {
                method: "DELETE",
            });
        }
    }

    const { WritableStream } = typeof window !== "undefined"
        ? window
        : typeof global !== "undefined"
            ? global
            : globalThis;

    var ws = null;

    if (typeof WebSocket !== "undefined") {
      ws = WebSocket;
    } else if (typeof MozWebSocket !== "undefined") {
      ws = MozWebSocket;
    } else if (typeof global !== "undefined") {
      ws = global.WebSocket || global.MozWebSocket;
    } else if (typeof window !== "undefined") {
      ws = window.WebSocket || window.MozWebSocket;
    } else if (typeof self !== "undefined") {
      ws = self.WebSocket || self.MozWebSocket;
    }

    var WebSocket$1 = ws;

    var RealtimeErrorType;
    (function (RealtimeErrorType) {
        RealtimeErrorType[RealtimeErrorType["BadSampleRate"] = 4000] = "BadSampleRate";
        RealtimeErrorType[RealtimeErrorType["AuthFailed"] = 4001] = "AuthFailed";
        // Both InsufficientFunds and FreeAccount error use 4002
        RealtimeErrorType[RealtimeErrorType["InsufficientFundsOrFreeAccount"] = 4002] = "InsufficientFundsOrFreeAccount";
        RealtimeErrorType[RealtimeErrorType["NonexistentSessionId"] = 4004] = "NonexistentSessionId";
        RealtimeErrorType[RealtimeErrorType["SessionExpired"] = 4008] = "SessionExpired";
        RealtimeErrorType[RealtimeErrorType["ClosedSession"] = 4010] = "ClosedSession";
        RealtimeErrorType[RealtimeErrorType["RateLimited"] = 4029] = "RateLimited";
        RealtimeErrorType[RealtimeErrorType["UniqueSessionViolation"] = 4030] = "UniqueSessionViolation";
        RealtimeErrorType[RealtimeErrorType["SessionTimeout"] = 4031] = "SessionTimeout";
        RealtimeErrorType[RealtimeErrorType["AudioTooShort"] = 4032] = "AudioTooShort";
        RealtimeErrorType[RealtimeErrorType["AudioTooLong"] = 4033] = "AudioTooLong";
        RealtimeErrorType[RealtimeErrorType["BadJson"] = 4100] = "BadJson";
        RealtimeErrorType[RealtimeErrorType["BadSchema"] = 4101] = "BadSchema";
        RealtimeErrorType[RealtimeErrorType["TooManyStreams"] = 4102] = "TooManyStreams";
        RealtimeErrorType[RealtimeErrorType["Reconnected"] = 4103] = "Reconnected";
        RealtimeErrorType[RealtimeErrorType["ReconnectAttemptsExhausted"] = 1013] = "ReconnectAttemptsExhausted";
    })(RealtimeErrorType || (RealtimeErrorType = {}));
    const RealtimeErrorMessages = {
        [RealtimeErrorType.BadSampleRate]: "Sample rate must be a positive integer",
        [RealtimeErrorType.AuthFailed]: "Not Authorized",
        [RealtimeErrorType.InsufficientFundsOrFreeAccount]: "Insufficient funds or you are using a free account. This feature is paid-only and requires you to add a credit card. Please visit https://assemblyai.com/dashboard/ to add a credit card to your account.",
        [RealtimeErrorType.NonexistentSessionId]: "Session ID does not exist",
        [RealtimeErrorType.SessionExpired]: "Session has expired",
        [RealtimeErrorType.ClosedSession]: "Session is closed",
        [RealtimeErrorType.RateLimited]: "Rate limited",
        [RealtimeErrorType.UniqueSessionViolation]: "Unique session violation",
        [RealtimeErrorType.SessionTimeout]: "Session Timeout",
        [RealtimeErrorType.AudioTooShort]: "Audio too short",
        [RealtimeErrorType.AudioTooLong]: "Audio too long",
        [RealtimeErrorType.BadJson]: "Bad JSON",
        [RealtimeErrorType.BadSchema]: "Bad schema",
        [RealtimeErrorType.TooManyStreams]: "Too many streams",
        [RealtimeErrorType.Reconnected]: "Reconnected",
        [RealtimeErrorType.ReconnectAttemptsExhausted]: "Reconnect attempts exhausted",
    };
    class RealtimeError extends Error {
    }

    const defaultRealtimeUrl = "wss://api.assemblyai.com/v2/realtime/ws";
    const forceEndOfUtteranceMessage = `{"force_end_utterance":true}`;
    const terminateSessionMessage = `{"terminate_session":true}`;
    class RealtimeTranscriber {
        constructor(params) {
            var _a, _b;
            this.listeners = {};
            this.realtimeUrl = (_a = params.realtimeUrl) !== null && _a !== void 0 ? _a : defaultRealtimeUrl;
            this.sampleRate = (_b = params.sampleRate) !== null && _b !== void 0 ? _b : 16000;
            this.wordBoost = params.wordBoost;
            this.encoding = params.encoding;
            this.endUtteranceSilenceThreshold =
                params.endUtteranceSilenceThreshold;
            if ("token" in params && params.token)
                this.token = params.token;
            if ("apiKey" in params && params.apiKey)
                this.apiKey = params.apiKey;
            if (!(this.token || this.apiKey)) {
                throw new Error("API key or temporary token is required.");
            }
        }
        connectionUrl() {
            const url = new URL(this.realtimeUrl);
            if (url.protocol !== "wss:") {
                throw new Error("Invalid protocol, must be wss");
            }
            const searchParams = new URLSearchParams();
            if (this.token) {
                searchParams.set("token", this.token);
            }
            searchParams.set("sample_rate", this.sampleRate.toString());
            if (this.wordBoost && this.wordBoost.length > 0) {
                searchParams.set("word_boost", JSON.stringify(this.wordBoost));
            }
            if (this.encoding) {
                searchParams.set("encoding", this.encoding);
            }
            url.search = searchParams.toString();
            return url;
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        on(event, listener) {
            this.listeners[event] = listener;
        }
        connect() {
            return new Promise((resolve) => {
                if (this.socket) {
                    throw new Error("Already connected");
                }
                const url = this.connectionUrl();
                if (this.token) {
                    this.socket = new WebSocket$1(url.toString());
                }
                else {
                    this.socket = new WebSocket$1(url.toString(), {
                        headers: { Authorization: this.apiKey },
                    });
                }
                this.socket.binaryType = "arraybuffer";
                this.socket.onopen = () => {
                    if (this.endUtteranceSilenceThreshold === undefined ||
                        this.endUtteranceSilenceThreshold === null) {
                        return;
                    }
                    this.configureEndUtteranceSilenceThreshold(this.endUtteranceSilenceThreshold);
                };
                this.socket.onclose = ({ code, reason }) => {
                    var _a, _b;
                    if (!reason) {
                        if (code in RealtimeErrorType) {
                            reason = RealtimeErrorMessages[code];
                        }
                    }
                    (_b = (_a = this.listeners).close) === null || _b === void 0 ? void 0 : _b.call(_a, code, reason);
                };
                this.socket.onerror = (event) => {
                    var _a, _b, _c, _d;
                    if (event.error)
                        (_b = (_a = this.listeners).error) === null || _b === void 0 ? void 0 : _b.call(_a, event.error);
                    else
                        (_d = (_c = this.listeners).error) === null || _d === void 0 ? void 0 : _d.call(_c, new Error(event.message));
                };
                this.socket.onmessage = ({ data }) => {
                    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
                    const message = JSON.parse(data.toString());
                    if ("error" in message) {
                        (_b = (_a = this.listeners).error) === null || _b === void 0 ? void 0 : _b.call(_a, new RealtimeError(message.error));
                        return;
                    }
                    switch (message.message_type) {
                        case "SessionBegins": {
                            const openObject = {
                                sessionId: message.session_id,
                                expiresAt: new Date(message.expires_at),
                            };
                            resolve(openObject);
                            (_d = (_c = this.listeners).open) === null || _d === void 0 ? void 0 : _d.call(_c, openObject);
                            break;
                        }
                        case "PartialTranscript": {
                            // message.created is actually a string when coming from the socket
                            message.created = new Date(message.created);
                            (_f = (_e = this.listeners).transcript) === null || _f === void 0 ? void 0 : _f.call(_e, message);
                            (_h = (_g = this.listeners)["transcript.partial"]) === null || _h === void 0 ? void 0 : _h.call(_g, message);
                            break;
                        }
                        case "FinalTranscript": {
                            // message.created is actually a string when coming from the socket
                            message.created = new Date(message.created);
                            (_k = (_j = this.listeners).transcript) === null || _k === void 0 ? void 0 : _k.call(_j, message);
                            (_m = (_l = this.listeners)["transcript.final"]) === null || _m === void 0 ? void 0 : _m.call(_l, message);
                            break;
                        }
                        case "SessionTerminated": {
                            (_o = this.sessionTerminatedResolve) === null || _o === void 0 ? void 0 : _o.call(this);
                            break;
                        }
                    }
                };
            });
        }
        sendAudio(audio) {
            this.send(audio);
        }
        stream() {
            return new WritableStream({
                write: (chunk) => {
                    this.sendAudio(chunk);
                },
            });
        }
        /**
         * Manually end an utterance
         */
        forceEndUtterance() {
            this.send(forceEndOfUtteranceMessage);
        }
        /**
         * Configure the threshold for how long to wait before ending an utterance. Default is 700ms.
         * @param threshold The duration of the end utterance silence threshold in milliseconds
         * @format integer
         */
        configureEndUtteranceSilenceThreshold(threshold) {
            this.send(`{"end_utterance_silence_threshold":${threshold}}`);
        }
        send(data) {
            if (!this.socket || this.socket.readyState !== WebSocket$1.OPEN) {
                throw new Error("Socket is not open for communication");
            }
            this.socket.send(data);
        }
        close(waitForSessionTermination = true) {
            return __awaiter(this, void 0, void 0, function* () {
                if (this.socket) {
                    if (this.socket.readyState === WebSocket$1.OPEN) {
                        if (waitForSessionTermination) {
                            const sessionTerminatedPromise = new Promise((resolve) => {
                                this.sessionTerminatedResolve = resolve;
                            });
                            this.socket.send(terminateSessionMessage);
                            yield sessionTerminatedPromise;
                        }
                        else {
                            this.socket.send(terminateSessionMessage);
                        }
                    }
                    if ("removeAllListeners" in this.socket)
                        this.socket.removeAllListeners();
                    this.socket.close();
                }
                this.listeners = {};
                this.socket = undefined;
            });
        }
    }
    /**
     * @deprecated Use RealtimeTranscriber instead
     */
    class RealtimeService extends RealtimeTranscriber {
    }

    class RealtimeTranscriberFactory extends BaseService {
        constructor(params) {
            super(params);
            this.rtFactoryParams = params;
        }
        /**
         * @deprecated Use transcriber(...) instead
         */
        createService(params) {
            return this.transcriber(params);
        }
        transcriber(params) {
            const serviceParams = Object.assign({}, params);
            if (!serviceParams.token && !serviceParams.apiKey) {
                serviceParams.apiKey = this.rtFactoryParams.apiKey;
            }
            return new RealtimeTranscriber(serviceParams);
        }
        createTemporaryToken(params) {
            return __awaiter(this, void 0, void 0, function* () {
                const data = yield this.fetchJson("/v2/realtime/token", {
                    method: "POST",
                    body: JSON.stringify(params),
                });
                return data.token;
            });
        }
    }
    /**
     * @deprecated Use RealtimeTranscriberFactory instead
     */
    class RealtimeServiceFactory extends RealtimeTranscriberFactory {
    }

    function getPath(path) {
        if (path.startsWith("http"))
            return null;
        if (path.startsWith("https"))
            return null;
        if (path.startsWith("file://"))
            return path.substring(7);
        if (path.startsWith("file:"))
            return path.substring(5);
        return path;
    }

    class TranscriptService extends BaseService {
        constructor(params, files) {
            super(params);
            this.files = files;
        }
        /**
         * Transcribe an audio file. This will create a transcript and wait until the transcript status is "completed" or "error".
         * @param params The parameters to transcribe an audio file.
         * @param options The options to transcribe an audio file.
         * @returns A promise that resolves to the transcript. The transcript status is "completed" or "error".
         */
        transcribe(params, options) {
            return __awaiter(this, void 0, void 0, function* () {
                const transcript = yield this.submit(params);
                return yield this.waitUntilReady(transcript.id, options);
            });
        }
        /**
         * Submits a transcription job for an audio file. This will not wait until the transcript status is "completed" or "error".
         * @param params The parameters to start the transcription of an audio file.
         * @returns A promise that resolves to the queued transcript.
         */
        submit(params) {
            return __awaiter(this, void 0, void 0, function* () {
                const { audio } = params, createParams = __rest(params, ["audio"]);
                let audioUrl;
                if (typeof audio === "string") {
                    const path = getPath(audio);
                    if (path !== null) {
                        // audio is local path, upload local file
                        audioUrl = yield this.files.upload(path);
                    }
                    else {
                        // audio is not a local path, assume it's a URL
                        audioUrl = audio;
                    }
                }
                else {
                    // audio is of uploadable type
                    audioUrl = yield this.files.upload(audio);
                }
                const data = yield this.fetchJson("/v2/transcript", {
                    method: "POST",
                    body: JSON.stringify(Object.assign(Object.assign({}, createParams), { audio_url: audioUrl })),
                });
                return data;
            });
        }
        /**
         * Create a transcript.
         * @param params The parameters to create a transcript.
         * @param options The options used for creating the new transcript.
         * @returns A promise that resolves to the transcript.
         * @deprecated Use `transcribe` instead to transcribe a audio file that includes polling, or `submit` to transcribe a audio file without polling.
         */
        create(params, options) {
            var _a;
            return __awaiter(this, void 0, void 0, function* () {
                const path = getPath(params.audio_url);
                if (path !== null) {
                    const uploadUrl = yield this.files.upload(path);
                    params.audio_url = uploadUrl;
                }
                const data = yield this.fetchJson("/v2/transcript", {
                    method: "POST",
                    body: JSON.stringify(params),
                });
                if ((_a = options === null || options === void 0 ? void 0 : options.poll) !== null && _a !== void 0 ? _a : true) {
                    return yield this.waitUntilReady(data.id, options);
                }
                return data;
            });
        }
        /**
         * Wait until the transcript ready, either the status is "completed" or "error".
         * @param transcriptId The ID of the transcript.
         * @param options The options to wait until the transcript is ready.
         * @returns A promise that resolves to the transcript. The transcript status is "completed" or "error".
         */
        waitUntilReady(transcriptId, options) {
            var _a, _b;
            return __awaiter(this, void 0, void 0, function* () {
                const pollingInterval = (_a = options === null || options === void 0 ? void 0 : options.pollingInterval) !== null && _a !== void 0 ? _a : 3000;
                const pollingTimeout = (_b = options === null || options === void 0 ? void 0 : options.pollingTimeout) !== null && _b !== void 0 ? _b : -1;
                const startTime = Date.now();
                // eslint-disable-next-line no-constant-condition
                while (true) {
                    const transcript = yield this.get(transcriptId);
                    if (transcript.status === "completed" || transcript.status === "error") {
                        return transcript;
                    }
                    else if (pollingTimeout > 0 &&
                        Date.now() - startTime > pollingTimeout) {
                        throw new Error("Polling timeout");
                    }
                    else {
                        yield new Promise((resolve) => setTimeout(resolve, pollingInterval));
                    }
                }
            });
        }
        /**
         * Retrieve a transcript.
         * @param id The identifier of the transcript.
         * @returns A promise that resolves to the transcript.
         */
        get(id) {
            return this.fetchJson(`/v2/transcript/${id}`);
        }
        /**
         * Retrieves a page of transcript listings.
         * @param parameters The parameters to filter the transcript list by, or the URL to retrieve the transcript list from.
         */
        list(parameters) {
            return __awaiter(this, void 0, void 0, function* () {
                let url = "/v2/transcript";
                if (typeof parameters === "string") {
                    url = parameters;
                }
                else if (parameters) {
                    url = `${url}?${new URLSearchParams(Object.keys(parameters).map((key) => {
                    var _a;
                    return [
                        key,
                        ((_a = parameters[key]) === null || _a === void 0 ? void 0 : _a.toString()) || "",
                    ];
                }))}`;
                }
                const data = yield this.fetchJson(url);
                for (const transcriptListItem of data.transcripts) {
                    transcriptListItem.created = new Date(transcriptListItem.created);
                    if (transcriptListItem.completed) {
                        transcriptListItem.completed = new Date(transcriptListItem.completed);
                    }
                }
                return data;
            });
        }
        /**
         * Delete a transcript
         * @param id The identifier of the transcript.
         * @returns A promise that resolves to the transcript.
         */
        delete(id) {
            return this.fetchJson(`/v2/transcript/${id}`, { method: "DELETE" });
        }
        /**
         * Search through the transcript for a specific set of keywords.
         * You can search for individual words, numbers, or phrases containing up to five words or numbers.
         * @param id The identifier of the transcript.
         * @param words Keywords to search for.
         * @return A promise that resolves to the sentences.
         */
        wordSearch(id, words) {
            const params = new URLSearchParams({ words: words.join(",") });
            return this.fetchJson(`/v2/transcript/${id}/word-search?${params.toString()}`);
        }
        /**
         * Retrieve all sentences of a transcript.
         * @param id The identifier of the transcript.
         * @return A promise that resolves to the sentences.
         */
        sentences(id) {
            return this.fetchJson(`/v2/transcript/${id}/sentences`);
        }
        /**
         * Retrieve all paragraphs of a transcript.
         * @param id The identifier of the transcript.
         * @return A promise that resolves to the paragraphs.
         */
        paragraphs(id) {
            return this.fetchJson(`/v2/transcript/${id}/paragraphs`);
        }
        /**
         * Retrieve subtitles of a transcript.
         * @param id The identifier of the transcript.
         * @param format The format of the subtitles.
         * @param chars_per_caption The maximum number of characters per caption.
         * @return A promise that resolves to the subtitles text.
         */
        subtitles(id, format = "srt", chars_per_caption) {
            return __awaiter(this, void 0, void 0, function* () {
                let url = `/v2/transcript/${id}/${format}`;
                if (chars_per_caption) {
                    const params = new URLSearchParams();
                    params.set("chars_per_caption", chars_per_caption.toString());
                    url += `?${params.toString()}`;
                }
                const response = yield this.fetch(url);
                return yield response.text();
            });
        }
        /**
         * Retrieve redactions of a transcript.
         * @param id The identifier of the transcript.
         * @return A promise that resolves to the subtitles text.
         */
        redactions(id) {
            return this.fetchJson(`/v2/transcript/${id}/redacted-audio`);
        }
    }

    const readFile = function (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    path) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error("Interacting with the file system is not supported in this environment.");
        });
    };

    class FileService extends BaseService {
        /**
         * Upload a local file to AssemblyAI.
         * @param input The local file path to upload, or a stream or buffer of the file to upload.
         * @return A promise that resolves to the uploaded file URL.
         */
        upload(input) {
            return __awaiter(this, void 0, void 0, function* () {
                let fileData;
                if (typeof input === "string")
                    fileData = yield readFile();
                else
                    fileData = input;
                const data = yield this.fetchJson("/v2/upload", {
                    method: "POST",
                    body: fileData,
                    headers: {
                        "Content-Type": "application/octet-stream",
                    },
                    duplex: "half",
                });
                return data.upload_url;
            });
        }
    }

    const defaultBaseUrl = "https://api.assemblyai.com";
    class AssemblyAI {
        /**
         * Create a new AssemblyAI client.
         * @param params The parameters for the service, including the API key and base URL, if any.
         */
        constructor(params) {
            params.baseUrl = params.baseUrl || defaultBaseUrl;
            if (params.baseUrl && params.baseUrl.endsWith("/"))
                params.baseUrl = params.baseUrl.slice(0, -1);
            this.files = new FileService(params);
            this.transcripts = new TranscriptService(params, this.files);
            this.lemur = new LemurService(params);
            this.realtime = new RealtimeTranscriberFactory(params);
        }
    }

    exports.AssemblyAI = AssemblyAI;
    exports.FileService = FileService;
    exports.LemurService = LemurService;
    exports.RealtimeService = RealtimeService;
    exports.RealtimeServiceFactory = RealtimeServiceFactory;
    exports.RealtimeTranscriber = RealtimeTranscriber;
    exports.RealtimeTranscriberFactory = RealtimeTranscriberFactory;
    exports.TranscriptService = TranscriptService;

}));