require("rsocket-core")
require("rsocket-flowable")

import {Flowable, Single} from 'rsocket-flowable';

export type DataVariant<T = any> = Single<T> | Flowable<T> | Error;
