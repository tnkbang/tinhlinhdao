import { VoiceConnection } from "@discordjs/voice";
import { CommandInteraction, Message, TextChannel } from "discord.js";

export interface QueueOptions {
  interaction: CommandInteraction | Message;
  textChannel: TextChannel;
  connection: VoiceConnection;
}