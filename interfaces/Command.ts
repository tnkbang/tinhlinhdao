import { SlashCommandBuilder } from "discord.js";

export class CommandType {
  static Administrator = new String('admin')
  static MISC = new String('misc')
  static Music = new String('music')
  static Infomation = new String('info')
}

export interface DataOptions {
  name: string;
  sname?: string;
  type?: string;
  description?: string;
}

export interface Command {
  permissions?: string[];
  cooldown?: number;
  data?: SlashCommandBuilder;
  execute(...args: any): any;
}

export interface CommandPrefix {
  permissions?: string[];
  cooldown?: number;
  data?: DataOptions;
  execute(...args: any): any;
}