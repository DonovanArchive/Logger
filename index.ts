import util from "util";
import leeks from "leeks.js";
import { Internal, Strings } from "@uwu-codes/utils";

export default abstract class Logger {
	protected static COLORS = {
		time: leeks.colors.gray,
		log: leeks.colors.green,
		info: leeks.colors.green,
		error: leeks.colors.red,
		warn: leeks.colors.yellow,
		debug: leeks.colors.cyan,
		command: leeks.colors.green
	};

	get log() {
		return this._log.bind(this, "log");
	}
	get info() {
		return this._log.bind(this, "info");
	}
	get error() {
		return this._log.bind(this, "error");
	}
	get warn() {
		return this._log.bind(this, "warn");
	}
	get debug() {
		return this._log.bind(this, "debug");
	}
	get command() {
		return this._log.bind(this, "command");
	}

	protected _log(type: keyof typeof Logger["COLORS"], name: string | string[], message?: any) {
		const d = new Date();
		const time = d.toString().split(" ")[4];
		if (!name) throw new TypeError("Missing logger name.");
		if (!message) {
			message = name;
			name = "General";
		}
		if (typeof message !== "string") {
			if (message instanceof Buffer || typeof message === "function") message = message.toString();
			if (typeof message === "object") message = util.inspect(message, { depth: null, colors: true, showHidden: true });
		}

		this.saveToFile(Internal.consoleSanitize(this.replacer(`[${time}] ${Strings.ucwords(type)} | ${Array.isArray(name) ? name.join(" | ") : name.toString()} | ${message}\n`)));
		process.stdout.write(this.replacer(`[${Logger.COLORS.time(time)}] ${Logger.COLORS[type](Strings.ucwords(type))} | ${Array.isArray(name) ? name.map(n => Logger.COLORS[type](n)).join(" | ") : Logger.COLORS[type](name.toString())} | ${Logger.COLORS[type](message)}\n`));
	}

	protected abstract replacer(str: string): string;
	protected abstract saveToFile(str: string): void;

	initOverrides() {
		global.console.log = this.log;
		global.console.info = this.info;
		global.console.error = this.error;
		global.console.warn = this.warn;
		global.console.debug = this.debug;
	}
}
