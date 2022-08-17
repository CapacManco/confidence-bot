import DiscordJS, { GatewayIntentBits, Partials } from 'discord.js';
import {
  collection,
  query,
  where,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import db from './utils/firebaseConfig.js';
// import { second, hour, day, week, month } from './dataCallManager.js';
import schedule from 'node-schedule';

import dotenv from 'dotenv';
dotenv.config();

// client = the bot
// intents = what the bot need to use

const client = new DiscordJS.Client({
  intents: [
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ],
  partials: [Partials.Channel],
});

// When client is ready
client.on('ready', () => {
  console.log('Bot ready !');
  dataCallManager();
});

// Server commands handling
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName } = interaction;

  if (commandName === 'unsubscribe') {
    deleteUser(interaction);
  } else if (commandName === 'subscribe') {
    let option = interaction.options.get('frequency');
    saveUserData(interaction, option.value);
  }
});

// Bot logging in
client.login(process.env.TOKEN);

// Variables
const phrases = [
  'You can do it, I believe in you.',
  'If someone has done it before you, then you can.',
  'My mom used to say : small dick spotted',
  'You will never change yourself, you stupid',
  'My dog is so hot',
  "You little pussycat dolls don't you ever think that again",
  'i would like to say "I love you" cuz it\'s the truth, but a wall is in front of us...',
];

// FUNCTIONS
// Add user ID to database
const checkUserExists = async (interaction) => {
  console.log('checking if user already exists...');
  const q = query(
    collection(db, 'users'),
    where('id', '==', interaction.user.id)
  );
  querySnapshot = await getDocs(q);
};

const deleteUser = async (interaction) => {
  // Check if users already exists

  console.log('checking if user already exists...');
  const q = query(
    collection(db, 'users'),
    where('id', '==', interaction.user.id)
  );
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    await interaction.reply(`You are not subscribed.`);
    return;
  }

  querySnapshot.forEach(async (document) => {
    deleteDoc(document.ref).then(async () => {
      await interaction.reply(
        `You have been successfully unsubscribed from the bot.`
      );
    });
  });
};

const saveUserData = async (interaction, frequency) => {
  // CHecking if frequency is allowed
  if (
    frequency === 'h' ||
    frequency === 'd' ||
    frequency === 'w' ||
    frequency === 'm'
  ) {
    console.log('checking if user already exists...');
    const q = query(
      collection(db, 'users'),
      where('id', '==', interaction.user.id)
    );
    const querySnapshot = await getDocs(q);

    // Add him to database if doesn't exist
    if (querySnapshot.empty) {
      try {
        const docRef = await addDoc(collection(db, 'users'), {
          platform: 'discord',
          id: interaction.user.id,
          frequency: frequency,
        });
        interaction.reply(
          `You have been added with the frequency 1/${frequency}`
        );
        return;
      } catch (e) {
        console.error('Error adding document: ', e);
      }
    }

    // Update frequency if the user exists
    querySnapshot.forEach(async (document) => {
      if (frequency !== document.data().frequency) {
        await updateDoc(document.ref, {
          frequency: frequency,
        });

        interaction.reply(`Your frequency has been changed to 1/${frequency}`);
      } else {
        // exit
        interaction.reply(
          'Your have already subscribed with the same frequency'
        );
      }
    });
  } else {
    {
      await interaction.reply(
        'Frequency not allowed. Choose between h, d, w and m.'
      );
      return;
    }
  }
};

// Data call manager to manage when to send message for who
const dataCallManager = () => {
  // Every second call
  schedule.scheduleJob('*/1 * * * * *', function () {
    retrieveData('d');
  });
  // Every hour call (at 0min of each hour)
  schedule.scheduleJob('0 * * * *', function () {
    retrieveData('h');
  });

  // Every day call 6:00 PM
  schedule.scheduleJob('00 18 * * *', function () {
    retrieveData('d');
  });

  // Every week (Monday) call 6:00 PM
  schedule.scheduleJob('00 18 * * 1', function () {
    retrieveData('w');
  });

  // Every first-day-of-month call 6:00 PM
  schedule.scheduleJob('0 18 1 * *', function () {
    retrieveData('m');
  });
};

// Function to retrieve data from database based on frequency
const retrieveData = async (frequency) => {
  console.log('retrieving data...');
  const q = query(
    collection(db, 'users'),
    where('frequency', '==', frequency),
    where('platform', '==', 'discord')
  );
  // ajouter la condition AND platform === discord

  const querySnapshot = await getDocs(q);
  const selectedUsersId = [];
  querySnapshot.forEach((doc) => {
    selectedUsersId.push(doc.data().id);
  });

  console.log(selectedUsersId);
  sendMessage(selectedUsersId);
};

// Function to send all the messages
async function sendMessage(usersId) {
  console.log('sending message..');
  const sentence = getRandomSentence();
  usersId.map(async (user) => {
    const member = await client.users.fetch(user);
    member.send(sentence);
  });
}

// Function to retrieve the phrases from the .json

const getRandomSentence = () => {
  const index = Math.floor(Math.random() * phrases.length);
  const sentence = phrases[index];
  phrases.splice(index, 1);

  return sentence;
};
