import { MusicQueuePrefix } from './MusicQueuePrefix';
import {
  ActivityType,
  ApplicationCommandDataResolvable,
  ChatInputCommandInteraction,
  Client,
  Collection,
  Events,
  Interaction,
  REST,
  Routes,
  Snowflake
} from "discord.js";
import { readdirSync } from "fs";
import { join } from "path";
import onRequestMessage from "../commands/prefix/main";
import { Command, CommandPrefix } from "../interfaces/Command";
import { checkPermissions, PermissionResult } from "../utils/checkPermissions";
import { config } from "../utils/config";
import { i18n } from "../utils/i18n";
import { MissingPermissionsException } from "../utils/MissingPermissionsException";
import { MusicQueue } from "./MusicQueue";

export class Bot {
  public readonly prefix = config.PREFIX;
  public commands = new Collection<string, Command>();
  public slashCommands = new Array<ApplicationCommandDataResolvable>();
  public slashCommandsMap = new Collection<string, Command>();
  public prefixCommandsMap = new Collection<string, CommandPrefix>();
  public favCommandsMap = new Collection<string, Command | CommandPrefix>();
  public cooldowns = new Collection<string, Collection<Snowflake, number>>();
  public queues = new Collection<Snowflake, MusicQueue | MusicQueuePrefix>();

  public constructor(public readonly client: Client) {
    this.client.login(config.TOKEN);

    this.client.on("ready", () => {
      //when run in repl
      // require("http").createServer((_, res) => res.end("Alive!")).listen(8080)

      console.log(`${this.client.user!.username} ready!`);

      client.user?.setActivity({
        name: "/help | " + config.PREFIX + "help",
        type: ActivityType.Listening
      })

      this.registerSlashCommands();
      this.registerPrefixCommands();
    });

    this.client.on("messageCreate", async (message) => {
      await onRequestMessage(message)
    })

    this.client.on("warn", (info) => console.log(info));
    this.client.on("error", console.error);

    this.onInteractionCreate();
  }

  private async registerSlashCommands() {
    const rest = new REST({ version: "9" }).setToken(config.TOKEN);

    const commandFiles = readdirSync(join(__dirname, "..", "commands", "slash")).filter((file) => !file.endsWith(".map"));

    for (const file of commandFiles) {
      const command = await import(join(__dirname, "..", "commands", "slash", `${file}`));

      this.slashCommands.push(command.default.data);
      this.slashCommandsMap.set(command.default.data.name, command.default);
    }

    await rest.put(Routes.applicationCommands(this.client.user!.id), { body: this.slashCommands });
  }

  private async registerPrefixCommands() {
    const commandFiles = readdirSync(join(__dirname, "..", "commands", "prefix")).filter((file) => !file.endsWith(".map"));

    for (const file of commandFiles) {
      const command = await import(join(__dirname, "..", "commands", "prefix", `${file}`));
      if (!command.default.data) continue

      this.prefixCommandsMap.set(command.default.data.name, command.default);
      if (command.default.data.sname) {
        command.default.data.sname.split(';').forEach((value: string) => {
          this.prefixCommandsMap.set(value, command.default);
        })
      }
    }
  }

  private async onInteractionCreate() {
    this.client.on(Events.InteractionCreate, async (interaction: Interaction): Promise<any> => {
      if (!interaction.isChatInputCommand()) return;

      const command = this.slashCommandsMap.get(interaction.commandName);

      if (!command) return;

      if (!this.cooldowns.has(interaction.commandName)) {
        this.cooldowns.set(interaction.commandName, new Collection());
      }

      const now = Date.now();
      const timestamps: any = this.cooldowns.get(interaction.commandName);
      const cooldownAmount = (command.cooldown || 1) * 1000;

      if (timestamps.has(interaction.user.id)) {
        const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

        if (now < expirationTime) {
          const timeLeft = (expirationTime - now) / 1000;
          return interaction.reply({
            content: i18n.__mf("common.cooldownMessage", {
              time: timeLeft.toFixed(1),
              name: interaction.commandName
            }),
            ephemeral: true
          });
        }
      }

      timestamps.set(interaction.user.id, now);
      setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

      try {
        const permissionsCheck: PermissionResult = await checkPermissions(command, interaction);

        if (permissionsCheck.result) {
          command.execute(interaction as ChatInputCommandInteraction);
        } else {
          throw new MissingPermissionsException(permissionsCheck.missing);
        }
      } catch (error: any) {
        console.error(error);

        if (error.message.includes("permissions")) {
          interaction.reply({ content: error.toString(), ephemeral: true }).catch(console.error);
        } else {
          interaction.reply({ content: i18n.__("common.errorCommand"), ephemeral: true }).catch(console.error);
        }
      }
    });
  }
}
