export type Rarity = 'Common' | 'Rare' | 'Epic' | 'Legendary';

export interface Reward {
  name: string;
  chance: number;
  minAmount?: number;
  maxAmount?: number;
  timeSaved?: number; // Builder time in hours
  labTimeSaved?: number; // Lab time in hours
  gems?: number; // Gem value if sold
}

export interface ChestData {
  rarity: Rarity;
  chance: number;
  rewards: Reward[];
}

export const CHEST_RARITY_RATES: Record<Rarity, number> = {
  Common: 0.58,
  Rare: 0.32,
  Epic: 0.08,
  Legendary: 0.02,
};

export const TOWN_HALL_REWARDS: Record<number, Record<Rarity, Reward[]>> = {
  18: {
    Common: [
      { name: 'Dark Elixir', chance: 0.1923, minAmount: 9500, maxAmount: 14250 },
      { name: 'Elixir', chance: 0.1154, minAmount: 800000, maxAmount: 1200000 },
      { name: 'Gold', chance: 0.1154, minAmount: 800000, maxAmount: 1200000 },
      { name: 'Builder Bite', chance: 0.0923, timeSaved: 6 },
      { name: 'Clan Castle Cake', chance: 0.0923 },
      { name: 'Study Soup', chance: 0.0923, labTimeSaved: 3 },
      { name: 'Power Pancakes', chance: 0.0923 },
      { name: 'Mighty Morsel', chance: 0.0923 },
      { name: 'Builder Elixir', chance: 0.0385 },
      { name: 'Builder Gold', chance: 0.0385 },
      { name: 'Capital Gold', chance: 0.0385, minAmount: 1000, maxAmount: 1500 },
    ],
    Rare: [
      { name: 'Hero Potion', chance: 0.0638, gems: 10 },
      { name: 'Research Potion', chance: 0.0638, labTimeSaved: 23, gems: 10 },
      { name: 'Power Potion', chance: 0.0638, gems: 10 },
      { name: 'Resource Potion', chance: 0.0638, gems: 10 },
      { name: 'Wall Rings', chance: 0.0638, minAmount: 2, maxAmount: 3, gems: 5 },
      { name: 'Dark Elixir', chance: 0.0638, minAmount: 19000, maxAmount: 28500 },
      { name: 'Elixir', chance: 0.0638, minAmount: 1600000, maxAmount: 2500000 },
      { name: 'Glowy Ore', chance: 0.0638, minAmount: 50, maxAmount: 75 },
      { name: 'Gold', chance: 0.0638, minAmount: 1600000, maxAmount: 2500000 },
      { name: 'Shiny Ore', chance: 0.0638, minAmount: 500, maxAmount: 750 },
      { name: 'Starry Ore', chance: 0.0638, minAmount: 6, maxAmount: 7 },
      { name: 'Builder Potion', chance: 0.0426, timeSaved: 54, gems: 10 },
      { name: 'Pet Potion', chance: 0.0426, gems: 10 },
      { name: 'Super Potion', chance: 0.0426, gems: 10 },
      { name: 'Capital Gold', chance: 0.0426, minAmount: 2000, maxAmount: 3000 },
      { name: 'Builder Star Jar', chance: 0.0319, gems: 10 },
      { name: 'Clock Tower Potion', chance: 0.0319, gems: 10 },
      { name: 'More Builder Elixir', chance: 0.0319 },
      { name: 'More Builder Gold', chance: 0.0319 },
    ],
    Epic: [
      { name: 'Capital House Part', chance: 0.1875 },
      { name: 'Decoration', chance: 0.125 },
      { name: 'Glowy Ore', chance: 0.10, minAmount: 150, maxAmount: 250 },
      { name: 'Shiny Ore', chance: 0.10, minAmount: 1500, maxAmount: 2500 },
      { name: 'Starry Ore', chance: 0.10, minAmount: 25, maxAmount: 35 },
      { name: 'Book of Building', chance: 0.0625, timeSaved: 15 * 24, gems: 50 },
      { name: 'Book of Fighting', chance: 0.0625, labTimeSaved: 15 * 24, gems: 50 },
      { name: 'Book of Heroes', chance: 0.0625, gems: 50 },
      { name: '2 Builder Potions', chance: 0.0625, timeSaved: 108, gems: 20 },
      { name: 'Shovel of Obstacles', chance: 0.0625, gems: 50 },
      { name: 'Book of Spells', chance: 0.025, labTimeSaved: 15 * 24, gems: 50 },
      { name: 'Rune of Builder Elixir', chance: 0.025, gems: 50 },
      { name: 'Rune of Builder Gold', chance: 0.025, gems: 50 },
    ],
    Legendary: [
      { name: 'Hero Skin', chance: 0.4211 },
      { name: 'Hero Equipment', chance: 0.2105 },
      { name: 'Hammer of Building', chance: 0.0526, timeSaved: 15 * 24 },
      { name: 'Hammer of Fighting', chance: 0.0526, labTimeSaved: 15 * 24 },
      { name: 'Hammer of Heroes', chance: 0.0526 },
      { name: 'Rune of Dark Elixir', chance: 0.0526, gems: 50 },
      { name: 'Rune of Elixir', chance: 0.0526, gems: 50 },
      { name: 'Rune of Gold', chance: 0.0526, gems: 50 },
      { name: 'Book of Everything', chance: 0.0316, timeSaved: 15 * 24, labTimeSaved: 15 * 24, gems: 50 },
      { name: 'Hammer of Spells', chance: 0.0211, labTimeSaved: 15 * 24 },
    ],
  },
};
