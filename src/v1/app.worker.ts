﻿var worker = new Worker("js/v1/kaitaiWorker.js");

var msgHandlers: { [msgId: number]: (msg: IWorkerMessage) => void } = {};

worker.onmessage = (ev: MessageEvent) => {
    var msg = <IWorkerMessage>ev.data;
    if (msgHandlers[msg.msgId])
        msgHandlers[msg.msgId](msg);
    delete msgHandlers[msg.msgId];
};

var lastMsgId = 0;
function workerCall(request: IWorkerMessage) {
    return new Promise<any>((resolve, reject) => {
        request.msgId = ++lastMsgId;
        msgHandlers[request.msgId] = response => {
            if (response.error) {
                console.log("error", response.error);
                if (response.result == null) { // intentionally !=, matches `undefined` or `null`
                    reject(response.error);
                }
            }
            resolve(response);

            //console.info(`[performance] [${(new Date()).format("H:i:s.u")}] Got worker response: ${Date.now()}.`);
        };
        worker.postMessage(request);
    });
}

export var workerMethods = {
    initCode: (sourceCode: string, mainClassName: string, ksyTypes: IKsyTypes) => {
        return <Promise<void>>workerCall({ type: "initCode", args: [sourceCode, mainClassName, ksyTypes] });
    },
    setInput: (inputBuffer: ArrayBuffer) => {
        return <Promise<void>>workerCall({ type: "setInput", args: [inputBuffer] });
    },
    reparse: (eagerMode: boolean) => {
        return <Promise<IWorkerMessage>>workerCall({ type: "reparse", args: [eagerMode] });
    },
    get: (path: string[]) => {
        return <Promise<IWorkerMessage>>workerCall({ type: "get", args: [path] });
    }
};
