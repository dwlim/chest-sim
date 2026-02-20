import { useState } from 'react';
import { CHEST_RARITY_RATES, TOWN_HALL_REWARDS } from './data';
import type { Rarity, Reward } from './data';
import './App.css';

interface RollResult {
  rarity: Rarity;
  reward: string;
  timeSaved?: number;
  labTimeSaved?: number;
  gems?: number;
}

interface BatchSummary {
  count: number;
  rarities: Record<Rarity, number>;
  totalTime: number;
  totalLabTime: number;
  totalGems: number;
}

function App() {
  const [results, setResults] = useState<RollResult[]>([]);
  const [batchSummary, setBatchSummary] = useState<BatchSummary | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [history, setHistory] = useState<RollResult[]>([]);
  const [totalTimeSaved, setTotalTimeSaved] = useState(0);
  const [totalLabTimeSaved, setTotalLabTimeSaved] = useState(0);
  const [totalGems, setTotalGems] = useState(0);
  const [totalChests, setTotalChests] = useState(0);
  const thLevel = 18;

  const formatTime = (totalHours: number) => {
    const days = Math.floor(totalHours / 24);
    const hours = Math.round(totalHours % 24);
    let parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0 || parts.length === 0) parts.push(`${hours}h`);
    return parts.join(' ');
  };

  const performRoll = (): RollResult => {
    const rarityRand = Math.random();
    let cumulativeRarity = 0;
    let rolledRarity: Rarity = 'Common';

    for (const [rarity, rate] of Object.entries(CHEST_RARITY_RATES)) {
      cumulativeRarity += rate;
      if (rarityRand <= cumulativeRarity) {
        rolledRarity = rarity as Rarity;
        break;
      }
    }

    const rewards = TOWN_HALL_REWARDS[thLevel][rolledRarity];
    const rewardRand = Math.random();
    let cumulativeReward = 0;
    
    const totalRewardChance = rewards.reduce((acc, r) => acc + r.chance, 0);
    const scaledRewardRand = rewardRand * totalRewardChance;

    let rolledReward: Reward = rewards[0];
    for (const reward of rewards) {
      cumulativeReward += reward.chance;
      if (scaledRewardRand <= cumulativeReward) {
        rolledReward = reward;
        break;
      }
    }

    let rewardText = rolledReward.name;
    if (rolledReward.minAmount !== undefined && rolledReward.maxAmount !== undefined) {
      const amount = Math.floor(
        Math.random() * (rolledReward.maxAmount - rolledReward.minAmount + 1) +
          rolledReward.minAmount
      );
      rewardText = `${amount.toLocaleString()} ${rolledReward.name}`;
    }

    return { 
      rarity: rolledRarity, 
      reward: rewardText, 
      timeSaved: rolledReward.timeSaved,
      labTimeSaved: rolledReward.labTimeSaved,
      gems: rolledReward.gems
    };
  };

  const rollChests = (count: number) => {
    setIsRolling(true);
    setResults([]);
    setBatchSummary(null);

    setTimeout(() => {
      const newResults: RollResult[] = [];
      let sessionTimeSaved = 0;
      let sessionLabTimeSaved = 0;
      let sessionGems = 0;
      const rarityCounts: Record<Rarity, number> = { Common: 0, Rare: 0, Epic: 0, Legendary: 0 };

      for (let i = 0; i < count; i++) {
        const roll = performRoll();
        rarityCounts[roll.rarity]++;
        if (roll.timeSaved) sessionTimeSaved += roll.timeSaved;
        if (roll.labTimeSaved) sessionLabTimeSaved += roll.labTimeSaved;
        if (roll.gems) sessionGems += roll.gems;
        
        if (count <= 11) {
          newResults.push(roll);
        }
      }

      if (count > 11) {
        setBatchSummary({
          count,
          rarities: rarityCounts,
          totalTime: sessionTimeSaved,
          totalLabTime: sessionLabTimeSaved,
          totalGems: sessionGems
        });
      } else {
        setResults(newResults);
      }

      setTotalTimeSaved(prev => prev + sessionTimeSaved);
      setTotalLabTimeSaved(prev => prev + sessionLabTimeSaved);
      setTotalGems(prev => prev + sessionGems);
      setTotalChests(prev => prev + count);
      
      const historyToAdd = count > 11 ? [] : newResults;
      setHistory((prev) => [...historyToAdd, ...prev].slice(0, 50));
      setIsRolling(false);
    }, count > 100 ? 300 : 600);
  };

  const avgBuilderPer11 = totalChests > 0 ? (totalTimeSaved / totalChests) * 11 : 0;
  const avgLabPer11 = totalChests > 0 ? (totalLabTimeSaved / totalChests) * 11 : 0;
  const avgGemsPer11 = totalChests > 0 ? (totalGems / totalChests) * 11 : 0;

  return (
    <div className="container">
      <h1>Clash of Clans Chest Simulator</h1>
      <p>Town Hall {thLevel} Rewards | {totalChests.toLocaleString()} Chests Opened</p>

      <div className="stats-panel">
        <div className="stat-row">
          <div className="stat-card builder">
            <div className="stat-label">Total Builder Time</div>
            <div className="stat-value">{formatTime(totalTimeSaved)}</div>
          </div>
          <div className="stat-card lab">
            <div className="stat-label">Total Lab Time</div>
            <div className="stat-value">{formatTime(totalLabTimeSaved)}</div>
          </div>
          <div className="stat-card gems">
            <div className="stat-label">Total Gems</div>
            <div className="stat-value">{totalGems.toLocaleString()}</div>
          </div>
        </div>
        <div className="stat-row efficiency">
          <div className="stat-card builder mini">
            <div className="stat-label">Avg. Saved / 11 (B)</div>
            <div className="stat-value">{formatTime(avgBuilderPer11)}</div>
          </div>
          <div className="stat-card lab mini">
            <div className="stat-label">Avg. Saved / 11 (L)</div>
            <div className="stat-value">{formatTime(avgLabPer11)}</div>
          </div>
          <div className="stat-card gems mini">
            <div className="stat-label">Avg. Gems / 11</div>
            <div className="stat-value">{avgGemsPer11.toFixed(1)}</div>
          </div>
        </div>
      </div>

      <div className="controls">
        <button className="roll-button" onClick={() => rollChests(1)} disabled={isRolling}>
          Open 1
        </button>
        <button className="roll-button mega" onClick={() => rollChests(11)} disabled={isRolling}>
          Open 11
        </button>
        <button className="roll-button ultra" onClick={() => rollChests(1000)} disabled={isRolling}>
          Sim 1000
        </button>
        <button className="reset-button" onClick={() => {
          setTotalTimeSaved(0);
          setTotalLabTimeSaved(0);
          setTotalGems(0);
          setTotalChests(0);
          setHistory([]);
          setResults([]);
          setBatchSummary(null);
        }}>Reset</button>
      </div>

      <div className="results-area">
        {isRolling ? (
          <div className="rolling">Simulating...</div>
        ) : batchSummary ? (
          <div className="batch-summary-card">
            <h3>Batch Results ({batchSummary.count.toLocaleString()})</h3>
            <div className="rarity-summary">
              <div className="rarity-count common">Common: {batchSummary.rarities.Common}</div>
              <div className="rarity-count rare">Rare: {batchSummary.rarities.Rare}</div>
              <div className="rarity-count epic">Epic: {batchSummary.rarities.Epic}</div>
              <div className="rarity-count legendary">Legendary: {batchSummary.rarities.Legendary}</div>
            </div>
            <div className="batch-totals">
              <div>B: <span className="builder">+{formatTime(batchSummary.totalTime)}</span></div>
              <div>L: <span className="lab">+{formatTime(batchSummary.totalLabTime)}</span></div>
              <div>Gems: <span className="gem-text">+{batchSummary.totalGems.toLocaleString()}</span></div>
            </div>
          </div>
        ) : results.length > 0 ? (
          <div className="results-grid">
            {results.map((res, i) => (
              <div key={i} className={`chest-result-small ${res.rarity.toLowerCase()}`}>
                <div className="rarity-badge-small">{res.rarity}</div>
                <div className="reward-text-small">{res.reward}</div>
                <div className="time-badges">
                  {res.timeSaved && <div className="time-saved-badge builder">+{formatTime(res.timeSaved)} B</div>}
                  {res.labTimeSaved && <div className="time-saved-badge lab">+{formatTime(res.labTimeSaved)} L</div>}
                  {res.gems && <div className="time-saved-badge gem-badge">+{res.gems} Gems</div>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="placeholder">Choose an option to start rolling!</div>
        )}
      </div>

      <div className="history">
        <h3>Recent Drops</h3>
        <div className="history-list">
          {history.length > 0 ? history.map((item, index) => (
            <div key={index} className={`history-item ${item.rarity.toLowerCase()}`}>
              <span className="rarity">{item.rarity}:</span> {item.reward}
              {item.timeSaved && <span className="time-saved-text builder"> (+{formatTime(item.timeSaved)} B)</span>}
              {item.labTimeSaved && <span className="time-saved-text lab"> (+{formatTime(item.labTimeSaved)} L)</span>}
              {item.gems && <span className="time-saved-text gem-text"> (+{item.gems} Gems)</span>}
            </div>
          )) : <div className="no-history">No recent individual rolls.</div>}
        </div>
      </div>

      <div className="info">
        <div className="rates">
          <h3>Drop Rates</h3>
          <ul>
            <li>Common: 58%</li>
            <li>Rare: 32%</li>
            <li>Epic: 8%</li>
            <li>Legendary: 2%</li>
          </ul>
        </div>
        <p>Data from Supercell Support</p>
      </div>
    </div>
  );
}

export default App;
