import { SlashCommandBuilder } from "discord.js";

export interface DataOptions {
  name: string;
  sname?: string;
  type?: string;
  description: string;
}

export interface Command {
  permissions?: string[];
  cooldown?: number;
  data?: SlashCommandBuilder | DataOptions;
  execute(...args: any): any;
}
