import {
  Client,
  Collection,
  GatewayIntentBits,
  ContextMenuCommandBuilder,
  ApplicationCommandType,
  Events,
  InteractionType,
  SnowflakeUtil,
  ApplicationCommandOptionType,
  ClientEvents,
  ClientApplication,
  Interaction,
  InteractionCollector,
  GuildMember,
} from 'discord.js';
import { ExtendedClient } from './types/ExtendedClient.types';
import { ExtendedCommandInteraction } from './types/ExtendedCommandInteraction.types';
import { Subcommands } from './types/Subcommands.types';

export const registerEvent = async (client: ExtendedClient) => {
  console.log('Interaction Create Event Registed');
  client.on(
    Events.InteractionCreate,
    async (interaction: ExtendedCommandInteraction) => {
      // Slash Command HandlinG
      const command = client.commands[interaction.commandName];
      if (!command)
        return interaction.followUp({
          content: 'An error has occured unfortunately ',
        });
      if (interaction.isContextMenuCommand()) {
        // On context menu
        command.execute({ client, interaction });
      } else if (interaction.isCommand()) {
        const subcommand = interaction.options.getSubcommand(false); // false means that it won't throw if interaction doesn't have subcommand
        if (subcommand) {
          const subcommandExecutors: Subcommands = (await command.execute({
            client,
            interaction,
          })) as Subcommands; // also runs any code inside the execute function, this is intended

          subcommandExecutors[subcommand]?.();

        } else {
          await command.execute({ client, interaction });
        }
      }
    }
  );
};
