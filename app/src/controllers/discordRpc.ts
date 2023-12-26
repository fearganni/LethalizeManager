import { Client } from 'discord-rpc';

export class DiscordRPC {
  private client: Client | null = null;
  private startTimestamp: Date = new Date();
  private retryDuration: number = 15; // in seconds
  private tasks = [this.updatePresence];

  connect(): void {
    if (this.client) {
      this.client.destroy();
      this.client = null;
    }

    this.client = new Client({ transport: 'ipc' });
    this.setupClientEventHandlers();
  }

  private setupClientEventHandlers(): void {
    this.client?.on('ready', async () => {
      console.debug(
        `Authorized as ${this.client?.user?.username}#${this.client?.user?.discriminator}`
      );
      await this.startup();
    });

    this.client?.once('close', () => {
      console.error('Connection to Discord closed. Attempting to reconnect...');
      setTimeout(() => this.connect(), this.retryDuration * 1000);
    });

    setTimeout(
      () => this.client?.login({ clientId: '1186462656081698846' }),
      this.retryDuration * 1000
    );
  }

  private async updatePresence(): Promise<void> {
    console.log(
      `Updating Rich Presence for ${this.client?.user?.username}#${this.client?.user?.discriminator}`
    );

    await this.client?.setActivity({
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

  private async startup(): Promise<void> {
    for (const task of this.tasks) {
      await task.bind(this)();
    }
  }
}
