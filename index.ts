import leeks from "leeks.js";
import { Internal, Strings } from "@uwu-codes/utils";
import util from "util";

export default class Logger {
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

	private static _log(type: keyof typeof Logger["COLORS"], name: string | Array<string>, message?: unknown) {
		const d = new Date();
		const time = d.toString().split(" ")[4];
		if (!name) throw new TypeError("Missing logger name.");
		if (!message) {
			message = name;
			name = "General";
		}
		if (typeof message !== "string") {
			if (message instanceof Buffer || typeof message === "function") message = (message as Buffer).toString();
			if (typeof message === "object") message = util.inspect(message, { depth: null, colors: true, showHidden: true });
		}

		this.saveToFile(Internal.consoleSanitize(this.replacer(`[${time}] ${Strings.ucwords(type)} | ${Array.isArray(name) ? name.join(" | ") : name.toString()} | ${String(message)}\n`)));
		process.stdout.write(this.replacer(`[${Logger.COLORS.time(time)}] ${Logger.COLORS[type](Strings.ucwords(type))} | ${Array.isArray(name) ? name.map(n => Logger.COLORS[type](n)).join(" | ") : Logger.COLORS[type](name.toString())} | ${Logger.COLORS[type](String(message))}\n`));
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
}
