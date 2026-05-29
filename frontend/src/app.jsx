import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import './i18n';
import { useTranslation } from 'react-i18next';

const API_BASE = "http://localhost:8000";

function App() {
  const { t, i18n } = useTranslation();
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [items, setItems] = useState([]);
  
  // --- 新增的状态变量 ---
  const [newItemTitle, setNewItemTitle] = useState(""); // 存项目名字
  const [duration, setDuration] = useState("");         // 存学习时长
  // --------------------

  // 获取用户列表
  useEffect(() => {
    axios.get(`${API_BASE}/users/`).then(res => setUsers(res.data));
  }, []);

  // 获取学习记录列表
  const fetchItems = useCallback(() => {
    if (currentUser) {
      axios.get(`${API_BASE}/users/${currentUser.id}/items/`)
        .then(res => setItems(res.data))
        .catch(err => console.error("获取失败:", err));
    }
  }, [currentUser]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // 添加记录函数
 const addItem = () => {
    axios.post(`${API_BASE}/items/?user_id=${currentUser.id}`, {
      title: newItemTitle,
      duration: parseFloat(duration), // 确保发的是数字
      language: "General"
    }).then(() => {
      setNewItemTitle("");
      setDuration("");
      fetchItems(); // 重新拉取数据
    });
  };
console.log("当前收到的原始数据 items:", items);
  // --- 核心逻辑：按项目名称自动汇总时长 ---
  const chartData = items.reduce((acc, item) => {
    const existing = acc.find(p => p.name === item.title);
    if (existing) {
      existing.value += item.duration;
    } else {
      acc.push({ name: item.title, value: item.duration });
    }
    return acc;
  }, []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div className="p-8 font-sans max-w-4xl mx-auto">
      <header className="flex justify-between items-center mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold">学习进度仪 Pro</h1>
        <div className="space-x-2">
          <button className="border px-2 py-1" onClick={() => i18n.changeLanguage('zh')}>中文</button>
          <button className="border px-2 py-1" onClick={() => i18n.changeLanguage('en')}>EN</button>
        </div>
      </header>

      {/* 1. 选择账号 */}
      <section className="mb-8">
        <select 
          className="p-2 border rounded w-full md:w-1/3"
          onChange={(e) => setCurrentUser(users.find(u => u.id == e.target.value))}
        >
          <option value="">-- 请选择账号 --</option>
          {users.map(u => <option key={u.id} value={u.id}>{u.username}</option>)}
        </select>
      </section>

      {currentUser && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* 2. 输入区域 */}
          <div className="bg-gray-50 p-6 rounded-xl border">
            <h2 className="text-xl mb-4 font-semibold">记录新项目</h2>
            <div className="flex flex-col space-y-4">
              <div>
                <label className="block text-sm mb-1">项目名称：</label>
                <input 
                  placeholder="例如：Python / 考研数学"
                  value={newItemTitle} 
                  onChange={e => setNewItemTitle(e.target.value)} 
                  className="border p-2 rounded w-full" 
                />
              </div>
              <div>
                <label className="block text-sm mb-1">学习时长 (小时)：</label>
                <input 
                  type="number"
                  placeholder="例如：1.5"
                  value={duration} 
                  onChange={e => setDuration(e.target.value)} 
                  className="border p-2 rounded w-full" 
                />
              </div>
              <button 
                onClick={addItem} 
                className="bg-blue-500 text-white font-bold p-2 rounded hover:bg-blue-600 transition-colors"
              >
                确认添加
              </button>
            </div>
          </div>

          {/* 3. 汇总图表 */}
          <div style={{ 
          height: '500px', 
          width: '100%', 
          border: '5px solid red', 
          marginTop: '50px', 
          padding: '20px',
          display: 'block',
          backgroundColor: '#f9f9f9'
        }}>
          <h2 style={{ textAlign: 'center', fontSize: '22px', marginBottom: '10px', color: 'black' }}>
            项目时长分布图 (小时)
          </h2>
          
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie 
                data={chartData} 
                innerRadius={70} 
                outerRadius={120} 
                paddingAngle={5} 
                dataKey="value"
                label={({name, value}) => `${name}: ${value}h`}
              >
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'][index % 5]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        </div>
      )}
    </div>
  );
}

export default App;