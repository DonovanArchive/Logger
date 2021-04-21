import { consoleSanitize, ucwords } from "./LocalFunctions";
import * as leeks from "leeks.js";
import util from "node:util";

export default class Logger {
	static DEPTH_LIMIT: number | null = 1;
	private static COLORS = {
		time: leeks.colors.gray,
		log: leeks.colors.green,
		info: leeks.colors.green,
		error: leeks.colors.red,
		warn: leeks.colors.yellow,
		debug: leeks.colors.cyan,
		command: leeks.colors.green
	};

	static get log() {
		return this._log.bind(this, "log");
	}
	static get info() {
		return this._log.bind(this, "info");
	}
	static get error() {
		return this._log.bind(this, "error");
	}
	static get warn() {
		return this._log.bind(this, "warn");
	}
	static get debug() {
		return this._log.bind(this, "debug");
	}
	static get command() {
		return this._log.bind(this, "command");
	}

	private static _log(type: keyof typeof Logger["COLORS"], name: string | Array<string>, ...message: Array<unknown>) {
		// this lets us distinguish between blatantly provided undefined, and no arguments
		// eslint-disable-next-line prefer-rest-params
		if (name === undefined && Object.prototype.hasOwnProperty.call(arguments, "1")) name = "undefined";
		const d = new Date();
		const time = d.toString().split(" ")[4];
		if (name === undefined) throw new TypeError("Missing logger name.");
		if (message === undefined || message.length === 0) {
			message[0] = name;
			name = "General";
		}

		function f(v: unknown) {
			if (typeof v !== "string") {
				if (Buffer.isBuffer(v) || typeof v === "function") v = v.toString();
				else v = util.inspect(v, { depth: Logger.DEPTH_LIMIT, colors: true });
			}
			return v;
		}

		const v = message.map(f).join(" ");

		this.saveToFile(consoleSanitize(this.replacer(`[${time}] ${ucwords(type)} | ${Array.isArray(name) ? name.join(" | ") : name.toString()} | ${v}\n`)));
		process.stdout.write(this.replacer(`[${Logger.COLORS.time(time)}] ${Logger.COLORS[type](ucwords(type))} | ${Array.isArray(name) ? name.map(n => Logger.COLORS[type](n)).join(" | ") : Logger.COLORS[type](name.toString())} | ${Logger.COLORS[type](v)}\n`));
	}

	static replacer(str: string) {
		return str;
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	static saveToFile(str: string) {
		// end user replaces this
	}

	static initOverrides() {
		global.console.log = this.log;
		global.console.info = this.info;
		global.console.error = this.error;
		global.console.warn = this.warn;
		global.console.debug = this.debug;
	}

	static setReplacer(func: typeof Logger["replacer"]) {
		this.replacer = func;
		return this;
	}

	static setSaveToFile(func: typeof Logger["saveToFile"]) {
		this.saveToFile = func;
		return this;
	}

	static setDepthLimit(limit: typeof Logger["DEPTH_LIMIT"]) {
		this.DEPTH_LIMIT = limit;
	}
}
