import {Message} from "protobufjs/light";

require("rsocket-core")
require("rsocket-flowable")

import {Flowable, Single} from 'rsocket-flowable';

export type DataVariant<T = Message> = T | Flowable<T> | Error | null;
