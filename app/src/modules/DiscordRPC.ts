import { Client } from 'discord-rpc';

export class DiscordRPC {
  client: Client | null = null;
  startTimestamp: Date = new Date();
  retryDuration: number = 15;

  i = 0;
  tasks = [this.updatePresence];

  connect(): void {
    if (this.client) this.client.destroy();

    // Create new discord rpc client
    this.client = new Client({
      transport: 'ipc',
    });

    // Once the client is ready to go
    this.client.on('ready', () => {
      console.debug(
        `Successfully authorised as ${this.client?.user?.username}#${this.client?.user?.discriminator}`
      );
      this.startup();
    });

    // Once the client becomes closed
    this.client.once('close', () => {
      console.error(`Connection to Discord closed. Attempting to reconnect...`);
      console.debug(
        `Automatically retrying to connect, please wait ${this.retryDuration} seconds...`
      );

      this.connect();
    });

    setTimeout(() => {
      this.client?.login({ clientId: '1186462656081698846' });
    }, this.retryDuration * 1000);
  }

  async updatePresence(): Promise<any> {
    console.log(
      `Successfully updated ${this.client?.user?.username}#${this.client?.user?.discriminator}'s Rich Presence!`
    );

    return this.client?.setActivity({
      details: 'Modifying my mods',
      largeImageKey: 'icon',
      largeImageText: 'Lethalize Manager',
      smallImageKey: 'featured',
      smallImageText: 'Made by @FearGanni',
      buttons: [
        {
          label: 'Check the github',
          url: 'https://github.com/fearganni/LethalizeManager',
        },
      ],
      startTimestamp: this.startTimestamp,
      instance: true,
    });
  }

  startup(): void {
    this.tasks[this.i++]();
    if (this.i < this.tasks.length) {
      setTimeout(this.startup, 5 * 1000);
    }
  }
}
