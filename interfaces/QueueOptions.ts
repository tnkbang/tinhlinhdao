import { VoiceConnection } from "@discordjs/voice";
import { CommandInteraction, Message, TextChannel } from "discord.js";

export interface QueueOptions {
  interaction: CommandInteraction;
  textChannel: TextChannel;
  connection: VoiceConnection;
}

export interface QueueOptionsPreifx {
  message: Message;
  textChannel: TextChannel;
  connection: VoiceConnection;
}