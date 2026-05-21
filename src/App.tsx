import React, { useEffect, useMemo, useState } from "react";
import {
  Check,
  ChevronRight,
  Circle,
  Home,
  Inbox,
  Lock,
  Pause,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Sword,
  Trash2,
} from "lucide-react";

const PROJECTS_KEY = "somanylanes-projects-v7";
const IDEAS_KEY = "somanylanes-ideas-v7";
const TRASH_RETENTION_DAYS = 60;
const DAY_MS = 24 * 60 * 60 * 1000;

const IDEA_CATEGORIES = ["全部", "灵感", "产品", "学习", "生活", "工作"];
const PROJECT_CATEGORIES = ["个人项目", "工作项目", "学习项目", "生活项目", "创意项目", "其他"];
const TASK_TYPES = ["小怪", "史莱姆", "哥布林", "骷髅兵", "精英怪", "支线", "主线", "探索", "训练", "BOSS"];
const TASK_WEIGHTS = [1, 2, 3, 5, 8, 10, 12, 15, 18, 20, 25, 30, 35, 40, 50];

const labelMaps = {
  ideaCategory: {
    全部: "All",
    灵感: "Inspiration",
    产品: "Product",
    学习: "Learning",
    生活: "Life",
    工作: "Work",
  },
  projectCategory: {
    全部: "All",
    个人项目: "Personal",
    工作项目: "Work",
    学习项目: "Learning",
    生活项目: "Life",
    创意项目: "Creative",
    其他: "Other",
  },
  taskType: {
    小怪: "Minion",
    史莱姆: "Slime",
    哥布林: "Goblin",
    骷髅兵: "Skeleton",
    精英怪: "Elite monster",
    支线: "Side quest",
    主线: "Main quest",
    探索: "Explore",
    训练: "Training",
    BOSS: "BOSS",
  },
};

function labelFor(lang, group, value) {
  if (lang === "zh") return value;
  return labelMaps[group]?.[value] || value;
}

const copyMap = {
  zh: {
    brand: "SoManyLanes",
    home: "首页",
    dashboard: "副本",
    ideas: "随手记",
    now: "现在就做",
    trash: "回收站",
    languageButton: "EN",
    savedLocal: "已保存到本机",
    heroTitle: "今天你填坑了吗？",
    heroDesc: "ADHD 友好的多项目管理器!!!你还有多少个坑同时开着......",
    homeBoardTitle: "副本",
    homeBoardDesc: "管理当前副本、切换副本、调整节点顺序、推进进度。",
    homeNowTitle: "现在就做",
    homeNowDesc: "每个副本当前可以做的一小步~你可以直接完成、进入副本，或者把任务先做5分钟。",
    homeIdeaTitle: "随手记",
    homeIdeaDesc: "想到什么就记下来！保护前额叶~",
    homeTrashTitle: "回收站",
    homeTrashDesc: "想法、副本、任务节点删除后先在这里保留 60 天。",
    open: "进入",
    boardTitle: "副本",
    boardDesc: "副本页用于推进当前项目：查看进度、管理节点、调整顺序，把注意力留给真正要做的任务。",
    ideaTitle: "随手记",
    ideaDesc: "想到什么就记下来！保护前额叶~",
    nowTitle: "现在就做",
    nowDesc: "每个副本当前可以做的一小步~你可以直接完成、进入副本，或者把任务只是先做 5 分钟！",
    trashTitle: "回收站",
    trashDesc: "删除的想法、副本和任务节点都会先放在这里，保留 60 天。你可以恢复，也可以永久删除。",
    quickIdea: "随手记",
    saveIdea: "保存想法",
    searchIdeas: "搜索想法",
    allIdeas: "全部想法",
    ideasHint: "想到什么就记下来！保护前额叶~",
    convertToProject: "转副本",
    deletedIdeas: "想法",
    deletedProjects: "副本",
    deletedTasks: "任务节点",
    restore: "恢复",
    permanentDelete: "永久删除",
    remaining: "剩余",
    days: "天",
    deletedAt: "删除于",
    addNode: "新增节点",
    addNodeDesc: "给当前副本添加一个新的任务节点，也可以批量粘贴或上传节点列表。",
    nodeNamePlaceholder: "节点名称，比如：写产品页标题",
    nodeDescPlaceholder: "节点描述，比如：写出可操作的一步，不求完整。",
    add: "加入",
    batchAdd: "批量加入",
    batchPlaceholder: "批量粘贴任务节点，每行一个：节点名称｜节点描述｜进度数字｜类型",
    batchTip: "每行用｜分隔。未填写进度或类型时，将使用默认值。",
    taskWeight: "进度比例",
    taskType: "节点类型",
    questLog: "Quest Log",
    questLogDesc: "点一下圆圈完成任务，描述可以直接编辑。已完成任务会自动沉到底部。",
    rescue: "坐牢",
    closeJail: "出狱",
    rescueMode: "卡关牢房",
    rescueDesc: "适合卡住时候用：记录卡关原因+思考解决办法。",
    jailReasonPlaceholder: "写下卡关原因，比如：不知道先做哪一步 / 信息太多 / 怕做得不好 / 需要别人确认...",
    jailReasonTitle: "卡关原因",
    jailPlanTitle: "出狱办法",
    jailPlanPlaceholder: "先写一个最小解决办法，比如：问谁 / 查哪条资料 / 先做哪个最小动作。",
    jailTip: "先别急着推进，把卡住的原因写出来，脑子就会少占一个后台进程。",
    seal: "封印",
    unseal: "解封",
    sealHint: "封印 = 暂时停靠这个副本。它不会被删除，但会从“现在就做”和推进流里隐藏，避免你被太多坑同时拉扯。",
    sealedPanelTitle: "这个副本已封印",
    sealedPanelDesc: "先不用管它。等你想重新推进时，点“解封”再继续。",
    project: "副本管理",
    projectHint: "切换 / 新增 / 删除副本都放在这里。坐牢自动置顶，已封印自动沉底，也可以拖动排序。",
    addProjectPlaceholder: "新增副本名称",
    projectType: "副本类型",
    projectLevel: "Lv.",
    filters: { active: "进行中", all: "全部", boss: "BOSS", sealed: "已封印" },
    statusActive: "进行中",
    statusSealed: "封印中",
    complete: "完成",
    enterProject: "进入副本",
    tiny: "先做5分钟",
    cancelTiny: "可以了",
    fiveMinuteLabel: "先做5分钟",
    fiveMinuteHint: "80% 以上的人都会在 5 分钟后继续做下去。",
    close: "关闭",
    emptyIdeas: "这里还没有匹配的想法。",
    noProject: "还没有副本",
    noProjectDesc: "先在右侧新建一个副本，再添加任务节点。",
    noTasks: "当前副本还没有任务节点。",
    noNow: "暂时没有下一步。可能所有副本都完成或已封印。",
    noTrashIdeas: "没有被删除的想法。",
    noTrashProjects: "没有被删除的副本。",
    noTrashTasks: "没有被删除的任务节点。",
    restoreTaskHint: "删除的任务节点会回到原副本里。",
    restoreProjectHint: "删除的副本会完整保留，60 天内可恢复。",
    restoreIdeaHint: "删除的想法会保留 60 天，恢复后回到随手记。",
    dungeonHint: "Dungeon = 一个完整副本，也就是一个独立项目。",
    levelHint: "Lv. 表示副本难度或推进复杂度，可以在新增副本时设定。",
    sealedBadgeHint: "sealed = 已封印，暂时停靠，不进入默认推进流。",
    manageProjects: "扩展管理",
    manageProjectsDesc: "在这里集中编辑副本命名、类型、Lv. 和备注，也可以按标签筛选查看。",
    projectNote: "副本备注",
    allProjectTypes: "全部类型",
    ideaViewList: "列表",
    ideaViewBubble: "泡泡",
  },
  en: {
    brand: "SoManyLanes",
    home: "Home",
    dashboard: "Dungeons",
    ideas: "Quick Notes",
    now: "Do It Now",
    trash: "Trash",
    languageButton: "中文",
    savedLocal: "Saved locally",
    heroTitle: "Did you fill a pit today?",
    heroDesc: "An ADHD-friendly multi-project manager!!! How many pits are still open at the same time......",
    homeBoardTitle: "Dungeons",
    homeBoardDesc: "Manage the current dungeon, switch dungeons, reorder nodes, and push progress.",
    homeNowTitle: "Do It Now",
    homeNowDesc: "One small step you can do for each dungeon right now. Complete it, enter the dungeon, or just do it for 5 minutes.",
    homeIdeaTitle: "Quick Notes",
    homeIdeaDesc: "Capture whatever pops up, and protect your prefrontal cortex.",
    homeTrashTitle: "Trash",
    homeTrashDesc: "Deleted ideas, dungeons, and task nodes stay here for 60 days.",
    open: "Open",
    boardTitle: "Dungeons",
    boardDesc: "Use the dungeon page to move the current project forward: review progress, manage nodes, reorder tasks, and keep attention on what actually needs doing.",
    ideaTitle: "Quick Notes",
    ideaDesc: "Capture whatever pops up, and protect your prefrontal cortex.",
    nowTitle: "Do It Now",
    nowDesc: "One small step you can do for each dungeon right now. Complete it, enter the dungeon, or just do it for 5 minutes.",
    trashTitle: "Trash",
    trashDesc: "Deleted ideas, dungeons, and task nodes stay here for 60 days. You can restore or permanently delete them.",
    quickIdea: "Quick capture",
    saveIdea: "Save idea",
    searchIdeas: "Search ideas",
    allIdeas: "All ideas",
    ideasHint: "Capture whatever pops up, and protect your prefrontal cortex.",
    convertToProject: "Turn into dungeon",
    deletedIdeas: "Ideas",
    deletedProjects: "Dungeons",
    deletedTasks: "Task nodes",
    restore: "Restore",
    permanentDelete: "Delete forever",
    remaining: "Left",
    days: "days",
    deletedAt: "Deleted at",
    addNode: "Add node",
    addNodeDesc: "Add a new task node to the current dungeon, or paste tasks in bulk.",
    nodeNamePlaceholder: "Node name, e.g. write product page title",
    nodeDescPlaceholder: "Node description, e.g. write one actionable step.",
    add: "Add",
    batchAdd: "Batch add",
    batchPlaceholder: "Paste task nodes in bulk, one per line: title｜description｜progress number｜type",
    batchTip: "Use ｜ to split each line. Missing progress or type will use defaults.",
    taskWeight: "Progress share",
    taskType: "Node type",
    questLog: "Quest Log",
    questLogDesc: "Tap the circle to complete. Descriptions are editable. Completed tasks move to the bottom.",
    rescue: "Stuck mode",
    closeJail: "Exit",
    rescueMode: "Stuck cell",
    rescueDesc: "Use this when blocked: record the stuck reason and think through a possible way out.",
    jailReasonPlaceholder: "Write the stuck reason: too many options / unclear first step / waiting for someone / afraid it will be bad...",
    jailReasonTitle: "Stuck reason",
    jailPlanTitle: "Exit plan",
    jailPlanPlaceholder: "Write one tiny way out: who to ask / what to check / which smallest action to try.",
    jailTip: "Do not force progress yet. Name the blocker first, then the brain has one less background process.",
    seal: "Seal",
    unseal: "Unseal",
    sealHint: "Seal = temporarily park this dungeon. It is not deleted, but hidden from Do It Now and default prompts.",
    sealedPanelTitle: "This dungeon is sealed",
    sealedPanelDesc: "You do not need to touch it now. Unseal it when you are ready to continue.",
    project: "Dungeon management",
    projectHint: "Switch, create, delete, and reorder dungeons here. Stuck items rise, sealed items sink.",
    addProjectPlaceholder: "New dungeon name",
    projectType: "Dungeon type",
    projectLevel: "Lv.",
    filters: { active: "Active", all: "All", boss: "BOSS", sealed: "Sealed" },
    statusActive: "Active",
    statusSealed: "Sealed",
    complete: "Complete",
    enterProject: "Open dungeon",
    tiny: "Start 5 min",
    cancelTiny: "Done for now",
    fiveMinuteLabel: "Start 5 min",
    fiveMinuteHint: "Over 80% of people keep going after the first 5 minutes.",
    close: "Close",
    emptyIdeas: "No matching ideas yet.",
    noProject: "No dungeon yet",
    noProjectDesc: "Create one on the right, then add task nodes.",
    noTasks: "This dungeon has no active task nodes yet.",
    noNow: "No next step. Everything may be done or sealed.",
    noTrashIdeas: "No deleted ideas.",
    noTrashProjects: "No deleted dungeons.",
    noTrashTasks: "No deleted task nodes.",
    restoreTaskHint: "Deleted task nodes return to their original dungeon.",
    restoreProjectHint: "Deleted dungeons are kept for 60 days.",
    restoreIdeaHint: "Deleted ideas are kept for 60 days and return to Quick Notes when restored.",
    dungeonHint: "Dungeon = a standalone project lane.",
    levelHint: "Lv. means difficulty or complexity. Set it when creating a dungeon.",
    sealedBadgeHint: "sealed = parked for now, hidden from the default push flow.",
    manageProjects: "Manage",
    manageProjectsDesc: "Edit dungeon name, type, Lv. and notes in one place. Filter by tag/category.",
    projectNote: "Dungeon note",
    allProjectTypes: "All types",
    ideaViewList: "List",
    ideaViewBubble: "Bubbles",
  },
};

const tintMap = {
  blue: { bg: "bg-[#F0F7FF]", bar: "bg-[#007AFF]", ring: "ring-[#007AFF]/15" },
  purple: { bg: "bg-[#F4F1FF]", bar: "bg-[#7C5CFF]", ring: "ring-[#7C5CFF]/15" },
  green: { bg: "bg-[#F0FAF3]", bar: "bg-[#34C759]", ring: "ring-[#34C759]/15" },
};

const initialProjects = [
  {
    id: "store",
    icon: "🏰",
    title: "独立站古堡",
    subtitle: "把独立站从想法推进到上线",
    note: "",
    status: "主线推进中",
    level: 7,
    category: "工作项目",
    tint: "blue",
    paused: false,
    stuck: false,
    stuckReason: "",
    stuckPlan: "",
    deletedAt: null,
    tasks: [
      { id: "s1", title: "确认要卖的品类", weight: 12, done: true, type: "主线", action: "写下 3 个想卖的品类，不评价好坏。", deletedAt: null, focusMode: false, focusAction: "" },
      { id: "s2", title: "收集 5 个竞品网站", weight: 16, done: true, type: "探索", action: "只打开 1 个竞品，截图首页第一屏。", deletedAt: null, focusMode: false, focusAction: "" },
      { id: "s3", title: "写首页第一屏文案", weight: 18, done: false, type: "主线", action: "只写一句：这个网站帮谁解决什么问题。", deletedAt: null, focusMode: false, focusAction: "" },
      { id: "s4", title: "做产品页结构", weight: 20, done: false, type: "支线", action: "列出产品页必须出现的 6 个模块。", deletedAt: null, focusMode: false, focusAction: "" },
      { id: "s5", title: "上线第一个可访问版本", weight: 34, done: false, type: "BOSS", action: "先做一个能点开的版本，不追求完整。", deletedAt: null, focusMode: false, focusAction: "" },
    ],
  },
  {
    id: "ielts",
    icon: "🧙‍♀️",
    title: "雅思法师塔",
    subtitle: "低压刷题，不靠硬扛",
    note: "",
    status: "轻量修炼",
    level: 4,
    category: "学习项目",
    tint: "purple",
    paused: false,
    stuck: false,
    stuckReason: "",
    stuckPlan: "",
    deletedAt: null,
    tasks: [
      { id: "i1", title: "听力 Section 1", weight: 15, done: true, type: "训练", action: "只听前 5 分钟，先不对答案。", deletedAt: null, focusMode: false, focusAction: "" },
      { id: "i2", title: "整理错题词汇", weight: 15, done: false, type: "支线", action: "只复制 5 个不会的词。", deletedAt: null, focusMode: false, focusAction: "" },
      { id: "i3", title: "写 Task 2 开头", weight: 25, done: false, type: "主线", action: "只写背景句，不写整篇。", deletedAt: null, focusMode: false, focusAction: "" },
      { id: "i4", title: "口语 Part 2 录音", weight: 20, done: false, type: "训练", action: "只录 30 秒，不追求流利。", deletedAt: null, focusMode: false, focusAction: "" },
      { id: "i5", title: "完整模考一次", weight: 25, done: false, type: "BOSS", action: "先预约一个 40 分钟空档。", deletedAt: null, focusMode: false, focusAction: "" },
    ],
  },
  {
    id: "life",
    icon: "🌲",
    title: "生活整理森林",
    subtitle: "降低脑内噪音",
    note: "",
    status: "等待重启",
    level: 2,
    category: "生活项目",
    tint: "green",
    paused: true,
    stuck: false,
    stuckReason: "",
    stuckPlan: "",
    deletedAt: null,
    tasks: [
      { id: "l1", title: "清空桌面可见垃圾", weight: 20, done: true, type: "支线", action: "只拿一个袋子，把明显垃圾扔掉。", deletedAt: null, focusMode: false, focusAction: "" },
      { id: "l2", title: "衣服分成两堆", weight: 25, done: false, type: "主线", action: "只处理椅子上的衣服。", deletedAt: null, focusMode: false, focusAction: "" },
      { id: "l3", title: "常用物品归位", weight: 25, done: false, type: "探索", action: "只找钥匙、耳机、充电器三个东西的位置。", deletedAt: null, focusMode: false, focusAction: "" },
      { id: "l4", title: "睡前收尾流程", weight: 30, done: false, type: "BOSS", action: "写一个 3 步睡前流程，不执行也可以。", deletedAt: null, focusMode: false, focusAction: "" },
    ],
  },
];

const initialIdeas = [
  { id: "idea-1", text: "给任务加一个坐牢中按钮", category: "产品", createdAt: "2026-05-19T10:00:00.000Z", deletedAt: null },
  { id: "idea-2", text: "首页要像任务本，不要像游戏厅", category: "产品", createdAt: "2026-05-19T10:01:00.000Z", deletedAt: null },
  { id: "idea-3", text: "项目卡住时记录原因和解决办法", category: "灵感", createdAt: "2026-05-19T10:02:00.000Z", deletedAt: null },
];

function activeTasksOf(project) {
  return (project.tasks || []).filter((task) => !task.deletedAt);
}

function orderedTasksOf(project) {
  return [...activeTasksOf(project)].sort((a, b) => Number(a.done) - Number(b.done));
}

function progressOf(project) {
  const tasks = activeTasksOf(project);
  const total = tasks.reduce((sum, task) => sum + Number(task.weight || 0), 0);
  const done = tasks.filter((task) => task.done).reduce((sum, task) => sum + Number(task.weight || 0), 0);
  return total ? Math.round((done / total) * 100) : 0;
}

function nextTask(project) {
  return activeTasksOf(project).find((task) => !task.done) || null;
}

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

function makeId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function daysLeftInTrash(item) {
  if (!item.deletedAt) return TRASH_RETENTION_DAYS;
  const deletedTime = new Date(item.deletedAt).getTime();
  if (Number.isNaN(deletedTime)) return TRASH_RETENTION_DAYS;
  const elapsedDays = Math.floor((Date.now() - deletedTime) / DAY_MS);
  return Math.max(0, TRASH_RETENTION_DAYS - elapsedDays);
}

function isTrashExpired(item) {
  return Boolean(item.deletedAt) && daysLeftInTrash(item) <= 0;
}

function normalizeIdeas(value) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item, index) => {
      if (typeof item === "string") {
        return { id: `legacy-idea-${index}`, text: item, category: "灵感", createdAt: new Date().toISOString(), deletedAt: null };
      }
      return {
        id: item.id || `idea-${index}`,
        text: String(item.text || ""),
        category: item.category || "灵感",
        createdAt: item.createdAt || new Date().toISOString(),
        deletedAt: item.deletedAt || null,
      };
    })
    .filter((idea) => !isTrashExpired(idea));
}

function normalizeProjects(value) {
  if (!Array.isArray(value)) return initialProjects;
  return value
    .map((project, index) => ({
      id: project.id || `project-${index}`,
      icon: project.icon || "🗺️",
      title: project.title || "Untitled",
      subtitle: project.subtitle || "",
      note: project.note || "",
      status: project.status || "",
      level: Number(project.level || 1),
      category: project.category || "个人项目",
      tint: project.tint || "blue",
      paused: Boolean(project.paused),
      stuck: Boolean(project.stuck),
      stuckReason: project.stuckReason || "",
      stuckPlan: project.stuckPlan || "",
      deletedAt: project.deletedAt || null,
      tasks: Array.isArray(project.tasks)
        ? project.tasks
            .map((task, taskIndex) => ({
              id: task.id || `task-${taskIndex}`,
              title: task.title || "Untitled task",
              weight: Number(task.weight || 10),
              done: Boolean(task.done),
              type: task.type || "支线",
              action: task.action || "",
              deletedAt: task.deletedAt || null,
              focusMode: Boolean(task.focusMode),
              focusAction: String(task.focusAction || "").replace("。只做开头，不求完成。", "").replace(". Just begin, no need to finish.", ""),
            }))
            .filter((task) => !isTrashExpired(task))
        : [],
    }))
    .filter((project) => !isTrashExpired(project));
}

function loadFromStorage(key, fallback, normalizer) {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return normalizer(JSON.parse(raw));
  } catch {
    return fallback;
  }
}

function saveToStorage(key, value) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Preview environments may block localStorage writes.
  }
}

function createBlankProject({ id, title, index = 0, lang = "zh", category = "个人项目", level = 1 }) {
  const icons = ["🗺️", "🌙", "🧩", "🏕️"];
  const tints = ["blue", "purple", "green"];
  return {
    id,
    icon: icons[index % icons.length],
    title,
    subtitle: lang === "zh" ? "新的副本，先添加第一个任务节点" : "A new dungeon. Add the first task node.",
    note: "",
    status: lang === "zh" ? "刚刚创建" : "Just created",
    level: Number(level) || 1,
    category,
    tint: tints[index % tints.length],
    paused: false,
    stuck: false,
    stuckReason: "",
    stuckPlan: "",
    deletedAt: null,
    tasks: [],
  };
}

function runSelfTests() {
  const project = {
    tasks: [
      { id: "done-a", weight: 20, done: true },
      { id: "deleted", weight: 30, done: false, deletedAt: new Date().toISOString() },
      { id: "done-b", weight: 50, done: true },
    ],
  };
  console.assert(progressOf(project) === 100, "progressOf should ignore deleted tasks.");
  console.assert(progressOf({ tasks: [] }) === 0, "progressOf should return 0 for empty tasks.");
  console.assert(nextTask({ tasks: [{ done: true }, { done: false, deletedAt: new Date().toISOString() }, { id: "next", done: false }] }).id === "next", "nextTask should ignore deleted tasks.");
  console.assert(orderedTasksOf({ tasks: [{ id: "done", done: true }, { id: "todo", done: false }] })[0].id === "todo", "orderedTasksOf should put unfinished tasks first.");
  console.assert(normalizeIdeas(["hello"])[0].category === "灵感", "normalizeIdeas should add default idea category.");
  console.assert(normalizeProjects([{ id: "p", stuck: true, stuckPlan: "ask", tasks: [{ id: "t", focusMode: true, focusAction: "start" }] }])[0].stuckPlan === "ask", "normalizeProjects should preserve stuck plan.");
  console.assert(Array.isArray(TASK_WEIGHTS) && TASK_WEIGHTS.includes(50), "TASK_WEIGHTS should include expanded progress options.");
  console.assert(labelFor("en", "projectCategory", "工作项目") === "Work", "labelFor should translate project categories.");
  console.assert(labelFor("en", "taskType", "史莱姆") === "Slime", "labelFor should translate task types.");
}

if (typeof console !== "undefined") runSelfTests();

function Card({ children, className = "", ...props }) {
  return <section {...props} className={cx("rounded-[14px] border border-black/[0.05] bg-white shadow-[0_24px_70px_rgba(0,0,0,0.055)]", className)}>{children}</section>;
}

function Button({ children, variant = "dark", className = "", ...props }) {
  const styles = {
    dark: "bg-[#1D1D1F] text-white hover:bg-black focus:ring-black/10 disabled:cursor-not-allowed disabled:opacity-50",
    light: "bg-[#F5F5F7] text-[#1D1D1F] hover:bg-[#ECECEF] focus:ring-black/10 disabled:cursor-not-allowed disabled:opacity-50",
    green: "bg-[#EAF8EE] text-[#1C7C38] hover:bg-[#DFF3E5] focus:ring-[#34C759]/20 disabled:cursor-not-allowed disabled:opacity-50",
  };
  return <button {...props} className={cx("inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-4 py-2 text-[15px] font-medium transition active:scale-[0.98] focus:outline-none focus:ring-4", styles[variant], className)}>{children}</button>;
}

function PixelBadge({ children, tone = "neutral", ...props }) {
  const styles = {
    neutral: "bg-[#F5F5F7] text-[#6E6E73] ring-black/[0.04]",
    blue: "bg-[#F0F7FF] text-[#007AFF] ring-[#007AFF]/10",
    gold: "bg-[#FFF6D6] text-[#8A6400] ring-[#FFD60A]/25",
    red: "bg-[#FFF1EF] text-[#D93025] ring-[#FF453A]/10",
    green: "bg-[#F0FAF3] text-[#248A3D] ring-[#34C759]/15",
  };
  return <span {...props} className={cx("inline-flex items-center gap-1 rounded-[9px] px-2 py-1 font-mono text-[11px] font-semibold leading-none ring-1", styles[tone])}>{children}</span>;
}

function PixelIcon({ children, className = "" }) {
  return <div className={cx("grid h-14 w-14 shrink-0 place-items-center rounded-[14px] text-[28px] ring-1 ring-black/[0.04]", className)}><span style={{ imageRendering: "pixelated" }}>{children}</span></div>;
}

function EmptyState({ children }) {
  return <div className="rounded-[16px] bg-[#F5F5F7] p-8 text-center text-[14px] leading-6 text-[#86868B]">{children}</div>;
}

function formatTime(value) {
  try {
    return new Intl.DateTimeFormat("zh-CN", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }).format(new Date(value));
  } catch {
    return "--";
  }
}

function AppNav({ activePage, setActivePage, trashCount, lang, setLang }) {
  const c = copyMap[lang];
  const items = [
    { id: "home", label: c.home, icon: Home },
    { id: "dashboard", label: c.dashboard, icon: Sword },
    { id: "now", label: c.now, icon: Check },
    { id: "ideas", label: c.ideas, icon: Inbox },
    { id: "trash", label: c.trash, icon: Trash2, count: trashCount },
  ];
  return (
    <nav className="sticky top-0 z-20 border-b border-black/[0.05] bg-[#F5F5F7]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3 sm:px-8">
        <button type="button" onClick={() => setActivePage("home")} className="flex items-center gap-2 rounded-full text-[15px] font-semibold text-[#1D1D1F] focus:outline-none focus:ring-4 focus:ring-black/10">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-white shadow-sm ring-1 ring-black/[0.04]">⚔️</span>
          {c.brand}
        </button>
        <div className="flex items-center gap-2 overflow-x-auto">
          <button type="button" onClick={() => setLang(lang === "zh" ? "en" : "zh")} className="min-h-9 shrink-0 rounded-full bg-white px-3 text-[13px] font-medium text-[#6E6E73] shadow-sm ring-1 ring-black/[0.05] transition hover:bg-[#F5F5F7] hover:text-[#1D1D1F] focus:outline-none focus:ring-4 focus:ring-black/10">{c.languageButton}</button>
          <div className="flex items-center gap-1 rounded-full bg-white p-1 shadow-sm ring-1 ring-black/[0.05]">
            {items.map((item) => {
              const Icon = item.icon;
              const active = activePage === item.id;
              return (
                <button key={item.id} type="button" onClick={() => setActivePage(item.id)} className={cx("inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-full px-3 text-[13px] font-medium transition focus:outline-none focus:ring-4 focus:ring-black/10", active ? "bg-[#1D1D1F] text-white" : "text-[#6E6E73] hover:bg-[#F5F5F7] hover:text-[#1D1D1F]")}>
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                  {item.count ? <span className={cx("ml-0.5 rounded-full px-1.5 py-0.5 text-[10px]", active ? "bg-white/20" : "bg-[#F5F5F7]")}>{item.count}</span> : null}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}

function FeatureCard({ icon, title, description, stat, button, onClick }) {
  return (
    <Card className="group p-6 transition hover:-translate-y-0.5 hover:shadow-[0_28px_80px_rgba(0,0,0,0.075)]">
      <button type="button" onClick={onClick} className="block w-full rounded-[14px] text-left focus:outline-none focus:ring-4 focus:ring-black/10">
        <div className="mb-8 flex items-start justify-between gap-5">
          <PixelIcon className="h-12 w-12 rounded-xl bg-[#F5F5F7] text-2xl">{icon}</PixelIcon>
          <PixelBadge tone="neutral">{stat}</PixelBadge>
        </div>
        <h2 className="text-[26px] font-semibold tracking-[-0.03em] text-[#1D1D1F]">{title}</h2>
        <p className="mt-3 min-h-[52px] text-[15px] leading-7 text-[#86868B]">{description}</p>
        <div className="mt-7 inline-flex items-center gap-1 text-[14px] font-semibold text-[#007AFF]">{button} <ChevronRight className="h-4 w-4 transition group-hover:translate-x-0.5" /></div>
      </button>
    </Card>
  );
}

export default function ADHDQuestBoardPrototype() {
  const [activePage, setActivePage] = useState("home");
  const [lang, setLang] = useState("zh");
  const [projects, setProjects] = useState(() => loadFromStorage(PROJECTS_KEY, initialProjects, normalizeProjects));
  const [selectedId, setSelectedId] = useState("store");
  const [ideas, setIdeas] = useState(() => loadFromStorage(IDEAS_KEY, initialIdeas, normalizeIdeas));
  const [thought, setThought] = useState("");
  const [newIdeaCategory, setNewIdeaCategory] = useState("灵感");
  const [ideaCategoryFilter, setIdeaCategoryFilter] = useState("全部");
  const [ideaSearch, setIdeaSearch] = useState("");
  const [nextFilter, setNextFilter] = useState("active");
  const [newTask, setNewTask] = useState("");
  const [newTaskAction, setNewTaskAction] = useState("");
  const [newWeight, setNewWeight] = useState(10);
  const [newTaskType, setNewTaskType] = useState("支线");
  const [batchText, setBatchText] = useState("");
  const [newProjectTitle, setNewProjectTitle] = useState("");
  const [newProjectCategory, setNewProjectCategory] = useState("个人项目");
  const [newProjectLevel, setNewProjectLevel] = useState(1);
  const [projectManagerOpen, setProjectManagerOpen] = useState(false);
  const [projectCategoryFilter, setProjectCategoryFilter] = useState("全部");
  const [ideaView, setIdeaView] = useState("list");
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [draggingTask, setDraggingTask] = useState(null);
  const [draggingProjectId, setDraggingProjectId] = useState(null);
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [draftTitle, setDraftTitle] = useState("");

  const c = copyMap[lang];
  const activeProjects = useMemo(() => projects.filter((project) => !project.deletedAt), [projects]);
  const visibleProjects = useMemo(() => [...activeProjects].sort((a, b) => {
    const priority = (project) => (project.stuck ? 0 : project.paused ? 2 : 1);
    return priority(a) - priority(b);
  }), [activeProjects]);
  const managedProjects = useMemo(() => {
    if (projectCategoryFilter === "全部") return visibleProjects;
    return visibleProjects.filter((project) => (project.category || "个人项目") === projectCategoryFilter);
  }, [visibleProjects, projectCategoryFilter]);
  const trashProjects = useMemo(() => projects.filter((project) => project.deletedAt), [projects]);
  const activeIdeas = useMemo(() => ideas.filter((idea) => !idea.deletedAt), [ideas]);
  const trashIdeas = useMemo(() => ideas.filter((idea) => idea.deletedAt), [ideas]);
  const trashTasks = useMemo(() => projects.flatMap((project) => (project.tasks || []).filter((task) => task.deletedAt).map((task) => ({ project, task }))), [projects]);
  const selected = activeProjects.find((project) => project.id === selectedId) || activeProjects[0] || null;
  const tint = tintMap[selected?.tint] || tintMap.blue;
  const progress = selected ? progressOf(selected) : 0;
  const trashCount = trashProjects.length + trashTasks.length + trashIdeas.length;

  const allNextSteps = useMemo(() => visibleProjects.map((project) => ({ project, task: nextTask(project), progress: progressOf(project) })).filter((item) => item.task), [visibleProjects]);
  const filteredNextSteps = useMemo(() => {
    if (nextFilter === "boss") return allNextSteps.filter((item) => item.task.type === "BOSS");
    if (nextFilter === "sealed") return allNextSteps.filter((item) => item.project.paused);
    if (nextFilter === "all") return allNextSteps;
    return allNextSteps.filter((item) => !item.project.paused);
  }, [allNextSteps, nextFilter]);
  const filteredIdeas = useMemo(() => {
    const query = ideaSearch.trim().toLowerCase();
    return activeIdeas.filter((idea) => {
      const matchSearch = !query || idea.text.toLowerCase().includes(query);
      const matchCategory = ideaCategoryFilter === "全部" || (idea.category || "灵感") === ideaCategoryFilter;
      return matchSearch && matchCategory;
    });
  }, [activeIdeas, ideaSearch, ideaCategoryFilter]);

  useEffect(() => saveToStorage(PROJECTS_KEY, projects), [projects]);
  useEffect(() => saveToStorage(IDEAS_KEY, ideas), [ideas]);
  useEffect(() => {
    if (selectedId && activeProjects.some((project) => project.id === selectedId)) return;
    setSelectedId(activeProjects[0]?.id || "");
  }, [activeProjects, selectedId]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.querySelectorAll<HTMLTextAreaElement>('textarea[data-autosize="true"]').forEach((node) => {
      node.style.height = "auto";
      node.style.height = `${node.scrollHeight}px`;
    });
  }, [projects, selectedId, activePage]);

  function resizeTextarea(node) {
    if (!node) return;
    node.style.height = "auto";
    node.style.height = `${node.scrollHeight}px`;
  }

  function handleTaskActionChange(projectId, taskId, event) {
    resizeTextarea(event.currentTarget);
    updateTaskAction(projectId, taskId, event.currentTarget.value);
  }

  function addThought() {
    const value = thought.trim();
    if (!value) return;
    setIdeas((items) => [{ id: makeId("idea"), text: value, category: newIdeaCategory, createdAt: new Date().toISOString(), deletedAt: null }, ...items]);
    setThought("");
  }

  function deleteIdea(id) {
    const now = new Date().toISOString();
    setIdeas((items) => items.map((item) => (item.id === id ? { ...item, deletedAt: now } : item)));
  }

  function restoreIdea(id) {
    setIdeas((items) => items.map((item) => (item.id === id ? { ...item, deletedAt: null } : item)));
  }

  function permanentlyDeleteIdea(id) {
    setIdeas((items) => items.filter((item) => item.id !== id));
  }

  function updateIdeaCategory(id, category) {
    setIdeas((items) => items.map((item) => (item.id === id ? { ...item, category } : item)));
  }

  function completeTask(projectId, taskId) {
    setProjects((prev) => prev.map((project) => {
      if (project.id !== projectId || project.paused) return project;
      return { ...project, status: lang === "zh" ? "刚刚推进" : "Just advanced", tasks: project.tasks.map((task) => (task.id === taskId ? { ...task, done: !task.done } : task)) };
    }));
  }

  function updateTaskAction(projectId, taskId, action) {
    setProjects((prev) => prev.map((project) => (project.id !== projectId ? project : { ...project, tasks: project.tasks.map((task) => (task.id === taskId ? { ...task, action } : task)) })));
  }

  function updateTaskFocusAction(projectId, taskId, focusAction) {
    setProjects((prev) => prev.map((project) => (project.id !== projectId ? project : { ...project, tasks: project.tasks.map((task) => (task.id === taskId ? { ...task, focusAction } : task)) })));
  }

  function reorderTaskInProject(projectId, fromTaskId, toTaskId) {
    if (!fromTaskId || !toTaskId || fromTaskId === toTaskId) return;
    setProjects((prev) => prev.map((project) => {
      if (project.id !== projectId) return project;
      const tasks = [...project.tasks];
      const fromIndex = tasks.findIndex((task) => task.id === fromTaskId);
      const toIndex = tasks.findIndex((task) => task.id === toTaskId);
      if (fromIndex < 0 || toIndex < 0) return project;
      const [moved] = tasks.splice(fromIndex, 1);
      const adjustedIndex = fromIndex < toIndex ? toIndex - 1 : toIndex;
      tasks.splice(adjustedIndex, 0, moved);
      return { ...project, tasks };
    }));
  }

  function reorderProjectById(fromProjectId, toProjectId) {
    if (!fromProjectId || !toProjectId || fromProjectId === toProjectId) return;
    setProjects((prev) => {
      const items = [...prev];
      const fromIndex = items.findIndex((project) => project.id === fromProjectId);
      const toIndex = items.findIndex((project) => project.id === toProjectId);
      if (fromIndex < 0 || toIndex < 0) return prev;
      const [moved] = items.splice(fromIndex, 1);
      const adjustedIndex = fromIndex < toIndex ? toIndex - 1 : toIndex;
      items.splice(adjustedIndex, 0, moved);
      return items;
    });
  }

  function toggleFiveMinute(projectId, taskId) {
    setProjects((prev) => prev.map((project) => {
      if (project.id !== projectId) return project;
      return {
        ...project,
        status: lang === "zh" ? "已切换5分钟状态" : "5-min state updated",
        tasks: project.tasks.map((task) => {
          if (task.id !== taskId) return task;
          const nextFocusMode = !task.focusMode;
          const defaultFocusAction = lang === "zh" ? `先做5分钟：${task.title}` : `Start 5 min: ${task.title}`;
          return { ...task, focusMode: nextFocusMode, focusAction: task.focusAction || defaultFocusAction };
        }),
      };
    }));
  }

  function addTask() {
    const value = newTask.trim();
    if (!value || !selected || selected.paused) return;
    const weight = Number(newWeight);
    setProjects((prev) => prev.map((project) => {
      if (project.id !== selected.id) return project;
      return {
        ...project,
        tasks: [...project.tasks, { id: makeId("task"), title: value, weight, done: false, type: newTaskType, action: newTaskAction.trim() || (lang === "zh" ? "先把它缩成 5 分钟能开始的一步。" : "Shrink it into a step you can start in 5 minutes."), deletedAt: null, focusMode: false, focusAction: "" }],
      };
    }));
    setNewTask("");
    setNewTaskAction("");
    setNewWeight(10);
    setNewTaskType("支线");
    setTaskModalOpen(false);
  }

  function addBatchTasks() {
    if (!selected || selected.paused) return;
    const lines = batchText.split(/\n+/).map((line) => line.trim()).filter(Boolean);
    if (!lines.length) return;
    setProjects((prev) => prev.map((project) => {
      if (project.id !== selected.id) return project;
      const created = lines.map((line) => {
        const parts = line.split(/\s*[|｜]\s*/);
        const title = (parts[0] || "").trim();
        const action = (parts[1] || "").trim() || (lang === "zh" ? "先把它缩成 5 分钟能开始的一步。" : "Shrink it into a step you can start in 5 minutes.");
        const parsedWeight = Number(parts[2]);
        const type = (parts[3] || newTaskType).trim();
        return { id: makeId("task"), title: title || (lang === "zh" ? "未命名节点" : "Untitled node"), weight: Number.isFinite(parsedWeight) && parsedWeight > 0 ? parsedWeight : Number(newWeight), done: false, type, action, deletedAt: null, focusMode: false, focusAction: "" };
      });
      return { ...project, tasks: [...project.tasks, ...created] };
    }));
    setBatchText("");
    setTaskModalOpen(false);
  }

  function addProject() {
    const value = newProjectTitle.trim();
    if (!value) return;
    const project = createBlankProject({ id: makeId("project"), title: value, index: activeProjects.length, lang, category: newProjectCategory, level: newProjectLevel });
    setProjects((prev) => [project, ...prev]);
    setSelectedId(project.id);
    setNewProjectTitle("");
    setNewProjectCategory("个人项目");
    setNewProjectLevel(1);
  }

  function createProjectFromIdea(idea) {
    const project = createBlankProject({ id: makeId("project"), title: idea.text.slice(0, 18), index: activeProjects.length, lang, category: idea.category || "灵感", level: 1 });
    setProjects((prev) => [project, ...prev]);
    setSelectedId(project.id);
    setActivePage("dashboard");
  }

  function deleteTask(projectId, taskId) {
    const now = new Date().toISOString();
    setProjects((prev) => prev.map((project) => (project.id !== projectId ? project : { ...project, status: lang === "zh" ? "节点已进回收站" : "Node moved to trash", tasks: project.tasks.map((task) => (task.id === taskId ? { ...task, deletedAt: now } : task)) })));
  }

  function restoreTask(projectId, taskId) {
    setProjects((prev) => prev.map((project) => (project.id !== projectId ? project : { ...project, status: lang === "zh" ? "节点已恢复" : "Node restored", tasks: project.tasks.map((task) => (task.id === taskId ? { ...task, deletedAt: null } : task)) })));
  }

  function permanentlyDeleteTask(projectId, taskId) {
    setProjects((prev) => prev.map((project) => (project.id !== projectId ? project : { ...project, tasks: project.tasks.filter((task) => task.id !== taskId) })));
  }

  function moveProjectToTrash(projectId) {
    const now = new Date().toISOString();
    const nextActive = activeProjects.find((project) => project.id !== projectId);
    setProjects((prev) => prev.map((project) => (project.id === projectId ? { ...project, paused: true, deletedAt: now, status: lang === "zh" ? "回收站中" : "In trash" } : project)));
    if (selectedId === projectId) setSelectedId(nextActive?.id || "");
  }

  function restoreProject(projectId) {
    setProjects((prev) => prev.map((project) => (project.id === projectId ? { ...project, deletedAt: null, paused: false, status: lang === "zh" ? "已恢复" : "Restored" } : project)));
    setSelectedId(projectId);
    setActivePage("dashboard");
  }

  function permanentlyDeleteProject(projectId) {
    setProjects((prev) => prev.filter((project) => project.id !== projectId));
  }

  function updateProjectField(projectId, field, value) {
    setProjects((prev) => prev.map((project) => {
      if (project.id !== projectId) return project;
      return { ...project, [field]: field === "level" ? Number(value) || 1 : value };
    }));
  }

  function toggleJailSelected() {
    if (!selected || selected.paused) return;
    const nextStuck = !selected.stuck;
    setProjects((prev) => prev.map((project) => {
      if (project.id !== selected.id) return project;
      return { ...project, stuck: nextStuck, status: nextStuck ? (lang === "zh" ? "坐牢" : "Stuck") : (lang === "zh" ? "重新推进" : "Back in motion"), stuckReason: project.stuckReason || "", stuckPlan: project.stuckPlan || "" };
    }));
  }

  function toggleSealSelected() {
    if (!selected) return;
    setProjects((prev) => prev.map((project) => {
      if (project.id !== selected.id) return project;
      const nextPaused = !project.paused;
      return { ...project, paused: nextPaused, stuck: nextPaused ? false : project.stuck, status: nextPaused ? (lang === "zh" ? "已封印" : "Sealed") : (lang === "zh" ? "重新启动" : "Restarted") };
    }));
  }

  function startRename(project) {
    setEditingProjectId(project.id);
    setDraftTitle(project.title);
  }

  function commitRename() {
    const value = draftTitle.trim();
    if (!value || !editingProjectId) {
      setEditingProjectId(null);
      setDraftTitle("");
      return;
    }
    setProjects((prev) => prev.map((project) => (project.id === editingProjectId ? { ...project, title: value } : project)));
    setEditingProjectId(null);
    setDraftTitle("");
  }

  const appShell = (children) => (
    <div className="min-h-screen bg-[#F5F5F7] text-[#1D1D1F] antialiased" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Arial, sans-serif' }}>
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[#EAF4FF] blur-3xl" />
        <div className="absolute bottom-[-260px] right-[-180px] h-[560px] w-[560px] rounded-full bg-[#EEF9F1] blur-3xl" />
      </div>
      <AppNav activePage={activePage} setActivePage={setActivePage} trashCount={trashCount} lang={lang} setLang={setLang} />
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-40 rounded-full bg-white/80 px-3 py-2 text-[12px] font-medium text-[#6E6E73] shadow-[0_10px_30px_rgba(0,0,0,0.08)] ring-1 ring-black/[0.05] backdrop-blur">
        {c.savedLocal}
      </div>
    </div>
  );

  function renderIdeaList(fullPage = false) {
    const list = fullPage ? filteredIdeas : activeIdeas.slice(0, 3);
    if (!list.length) return <EmptyState>{c.emptyIdeas}</EmptyState>;
    return (
      <div className="space-y-3">
        {list.map((idea) => (
          <div key={idea.id} className="rounded-[16px] bg-[#F5F5F7] p-4">
            <div className="flex items-start gap-3">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white text-lg ring-1 ring-black/[0.04]">💡</div>
              <div className="min-w-0 flex-1">
                <div className="text-[15px] leading-6 text-[#1D1D1F]">{idea.text}</div>
                <div className="mt-2 flex flex-wrap items-center gap-2"><PixelBadge tone="neutral">{labelFor(lang, "ideaCategory", idea.category || "灵感")}</PixelBadge><span className="text-[12px] text-[#9A9AA0]">{formatTime(idea.createdAt)}</span></div>
              </div>
              {fullPage && <select value={idea.category || "灵感"} onChange={(event) => updateIdeaCategory(idea.id, event.target.value)} className="shrink-0 rounded-full border-0 bg-white px-3 py-1.5 text-[12px] font-medium text-[#6E6E73] ring-1 ring-black/[0.05] outline-none focus:ring-4 focus:ring-black/10">{IDEA_CATEGORIES.filter((category) => category !== "全部").map((category) => <option key={category} value={category}>{labelFor(lang, "ideaCategory", category)}</option>)}</select>}
              {fullPage && <button type="button" onClick={() => createProjectFromIdea(idea)} className="shrink-0 rounded-full bg-white px-3 py-1.5 text-[12px] font-medium text-[#007AFF] ring-1 ring-black/[0.05] transition hover:bg-[#F0F7FF] focus:outline-none focus:ring-4 focus:ring-black/10">{c.convertToProject}</button>}
              <button type="button" onClick={() => deleteIdea(idea.id)} className="grid h-8 w-8 place-items-center rounded-full text-[#A1A1A6] transition hover:bg-white hover:text-[#D93025] focus:outline-none focus:ring-4 focus:ring-black/10" aria-label="delete idea"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
      </div>
    );
  }

  function renderProjectSwitcher() {
    return (
      <Card className="p-6">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-[20px] font-semibold tracking-[-0.02em]">{c.project}</h3>
              <button type="button" onClick={() => setProjectManagerOpen(true)} className="rounded-full bg-[#F5F5F7] px-3 py-1.5 text-[12px] font-medium text-[#6E6E73] transition hover:bg-[#ECECEF] hover:text-[#1D1D1F] focus:outline-none focus:ring-4 focus:ring-black/10">{c.manageProjects}</button>
            </div>
            <p className="mt-0.5 text-[12px] font-normal text-[#9A9AA0]">{c.projectHint}</p>
          </div>
          <Sword className="h-5 w-5 shrink-0 text-[#C7C7CC]" />
        </div>
        <div className="mb-3 space-y-2">
          <div className="flex gap-2">
            <input value={newProjectTitle} onChange={(event) => setNewProjectTitle(event.target.value)} onKeyDown={(event) => event.key === "Enter" && addProject()} placeholder={c.addProjectPlaceholder} className="min-h-11 min-w-0 flex-1 rounded-full border-0 bg-[#F5F5F7] px-4 text-[14px] outline-none transition placeholder:text-[#A1A1A6] focus:bg-white focus:ring-4 focus:ring-black/10" />
            <Button onClick={addProject} className="h-11 w-11 shrink-0 px-0" aria-label="add dungeon"><Plus className="h-4 w-4" /></Button>
          </div>
          <div className="grid grid-cols-[1fr_96px] gap-2">
            <select value={newProjectCategory} onChange={(event) => setNewProjectCategory(event.target.value)} className="min-h-11 rounded-full border-0 bg-[#F5F5F7] px-4 text-[13px] font-medium text-[#6E6E73] outline-none focus:bg-white focus:ring-4 focus:ring-black/10" title={c.projectType}>{PROJECT_CATEGORIES.map((category) => <option key={category} value={category}>{labelFor(lang, "projectCategory", category)}</option>)}</select>
            <label className="flex min-h-11 items-center gap-1.5 rounded-full bg-[#F5F5F7] px-3 text-[13px] font-medium text-[#6E6E73] focus-within:bg-white focus-within:ring-4 focus-within:ring-black/10" title={c.projectLevel}>
              <span>Lv.</span>
              <input type="number" min="1" max="99" value={newProjectLevel} onChange={(event) => setNewProjectLevel(Number(event.target.value) || 1)} className="min-w-0 flex-1 border-0 bg-transparent p-0 text-[13px] font-medium outline-none" />
            </label>
          </div>
        </div>
        {visibleProjects.length ? (
          <div className="space-y-3">
            {visibleProjects.map((project) => {
              const p = progressOf(project);
              const active = project.id === selected?.id;
              const pt = tintMap[project.tint] || tintMap.blue;
              return (
                <div key={project.id} draggable onDragStart={() => setDraggingProjectId(project.id)} onDragOver={(event) => event.preventDefault()} onDrop={() => { reorderProjectById(draggingProjectId, project.id); setDraggingProjectId(null); }} className={cx("flex items-center gap-2 rounded-[14px] p-2 transition", active ? `bg-white shadow-sm ring-4 ${pt.ring}` : "bg-[#F5F5F7] hover:bg-white")}>
                  <div className="grid h-8 w-5 shrink-0 cursor-grab place-items-center rounded-full text-[14px] text-[#C7C7CC] active:cursor-grabbing">⋮⋮</div>
                  <button type="button" onClick={() => setSelectedId(project.id)} className="min-w-0 flex flex-1 items-center gap-3 rounded-[12px] p-2 text-left focus:outline-none focus:ring-4 focus:ring-black/10">
                    <PixelIcon className={cx("h-11 w-11 rounded-xl text-xl", pt.bg)}>{project.icon}</PixelIcon>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2"><div className="truncate text-[15px] font-semibold">{project.title}</div>{project.stuck && <PixelBadge tone="red">⛓ {c.rescue}</PixelBadge>}{project.paused && <PixelBadge tone="neutral">{c.seal}</PixelBadge>}</div>
                      <div className="mt-1 flex items-center gap-2 text-[12px] text-[#9A9AA0]"><span>{labelFor(lang, "projectCategory", project.category || "个人项目")}</span><span>Lv.{project.level}</span><span className="w-8 shrink-0 tabular-nums">{p}%</span><div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#E5E5EA]"><div className={cx("h-full rounded-full", pt.bar)} style={{ width: `${p}%` }} /></div></div>
                      <div className="mt-0.5 truncate text-[12px] text-[#9A9AA0]">{project.note || project.status}</div>
                    </div>
                  </button>
                  <button type="button" onClick={() => moveProjectToTrash(project.id)} className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-[#A1A1A6] transition hover:bg-[#F5F5F7] hover:text-[#D93025] focus:outline-none focus:ring-4 focus:ring-black/10"><Trash2 className="h-4 w-4" /></button>
                </div>
              );
            })}
          </div>
        ) : <EmptyState>{c.noProjectDesc}</EmptyState>}
      </Card>
    );
  }

  function renderProjectManagerModal() {
    if (!projectManagerOpen) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 px-5 py-8 backdrop-blur-sm">
        <button className="absolute inset-0 cursor-default" aria-label="close project manager" onClick={() => setProjectManagerOpen(false)} />
        <Card className="relative max-h-[86vh] w-full max-w-3xl overflow-auto p-6 sm:p-7">
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div><h3 className="text-[24px] font-semibold tracking-[-0.03em]">{c.manageProjects}</h3><p className="mt-1 text-[13px] leading-5 text-[#86868B]">{c.manageProjectsDesc}</p></div>
            <div className="flex gap-2"><select value={projectCategoryFilter} onChange={(event) => setProjectCategoryFilter(event.target.value)} className="min-h-10 rounded-full border-0 bg-[#F5F5F7] px-4 text-[13px] font-medium text-[#6E6E73] outline-none focus:bg-white focus:ring-4 focus:ring-black/10">{["全部", ...PROJECT_CATEGORIES].map((category) => <option key={category} value={category}>{category === "全部" ? c.allProjectTypes : labelFor(lang, "projectCategory", category)}</option>)}</select><button type="button" onClick={() => setProjectManagerOpen(false)} className="grid h-10 w-10 place-items-center rounded-full bg-[#F5F5F7] text-[18px] text-[#86868B] transition hover:bg-[#ECECEF] hover:text-[#1D1D1F] focus:outline-none focus:ring-4 focus:ring-black/10">x</button></div>
          </div>
          <div className="space-y-3">
            {managedProjects.map((project) => {
              const pt = tintMap[project.tint] || tintMap.blue;
              return (
                <div key={project.id} className="rounded-[16px] bg-[#F5F5F7] p-4">
                  <div className="grid gap-3 sm:grid-cols-[auto_1fr_120px_92px] sm:items-center">
                    <PixelIcon className={cx("h-11 w-11 rounded-xl text-xl", pt.bg)}>{project.icon}</PixelIcon>
                    <input value={project.title} onChange={(event) => updateProjectField(project.id, "title", event.target.value)} className="min-h-11 rounded-[14px] border-0 bg-white px-4 text-[14px] font-semibold outline-none focus:ring-4 focus:ring-black/10" />
                    <select value={project.category || "个人项目"} onChange={(event) => updateProjectField(project.id, "category", event.target.value)} className="min-h-11 rounded-[14px] border-0 bg-white px-3 text-[13px] font-medium text-[#6E6E73] outline-none focus:ring-4 focus:ring-black/10">{PROJECT_CATEGORIES.map((category) => <option key={category} value={category}>{labelFor(lang, "projectCategory", category)}</option>)}</select>
                    <label className="flex min-h-11 items-center gap-1.5 rounded-[14px] bg-white px-3 text-[13px] font-medium text-[#6E6E73] focus-within:ring-4 focus-within:ring-black/10"><span>Lv.</span><input type="number" min="1" max="99" value={project.level} onChange={(event) => updateProjectField(project.id, "level", event.target.value)} className="min-w-0 flex-1 border-0 bg-transparent p-0 outline-none" /></label>
                  </div>
                  <textarea value={project.note || ""} onChange={(event) => updateProjectField(project.id, "note", event.target.value)} placeholder={c.projectNote} rows={2} className="mt-3 w-full resize-none rounded-[14px] border-0 bg-white px-4 py-3 text-[13px] leading-5 text-[#6E6E73] outline-none focus:ring-4 focus:ring-black/10" />
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    );
  }

  function renderAddTaskModal() {
    if (!taskModalOpen) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 px-5 py-8 backdrop-blur-sm">
        <button className="absolute inset-0 cursor-default" aria-label="close modal" onClick={() => setTaskModalOpen(false)} />
        <Card className="relative w-full max-w-2xl p-6 sm:p-7">
          <div className="mb-5 flex items-start justify-between gap-4"><div><h3 className="text-[24px] font-semibold tracking-[-0.03em]">{c.addNode}</h3><p className="mt-1 text-[13px] leading-5 text-[#86868B]">{c.addNodeDesc}</p></div><button type="button" onClick={() => setTaskModalOpen(false)} className="grid h-9 w-9 place-items-center rounded-full bg-[#F5F5F7] text-[20px] text-[#86868B] transition hover:bg-[#ECECEF] hover:text-[#1D1D1F] focus:outline-none focus:ring-4 focus:ring-black/10" aria-label="close add node modal">x</button></div>
          <div className="space-y-3"><input value={newTask} onChange={(event) => setNewTask(event.target.value)} placeholder={selected ? c.nodeNamePlaceholder : c.noProject} disabled={!selected} className="min-h-11 w-full rounded-[14px] border-0 bg-[#F5F5F7] px-4 text-[15px] outline-none transition placeholder:text-[#A1A1A6] focus:bg-white focus:ring-4 focus:ring-black/10 disabled:opacity-50" /><textarea value={newTaskAction} onChange={(event) => setNewTaskAction(event.target.value)} placeholder={c.nodeDescPlaceholder} disabled={!selected} rows={3} className="w-full resize-none rounded-[14px] border-0 bg-[#F5F5F7] px-4 py-3 text-[15px] leading-6 outline-none transition placeholder:text-[#A1A1A6] focus:bg-white focus:ring-4 focus:ring-black/10 disabled:opacity-50" /><div className="grid gap-3 sm:grid-cols-2"><label className="space-y-1"><span className="text-[12px] font-medium text-[#86868B]">{c.taskWeight}</span><select value={newWeight} onChange={(event) => setNewWeight(Number(event.target.value) || 10)} disabled={!selected} className="min-h-11 w-full rounded-[14px] border-0 bg-[#F5F5F7] px-4 text-[15px] font-medium outline-none focus:bg-white focus:ring-4 focus:ring-black/10 disabled:opacity-50">{TASK_WEIGHTS.map((weight) => <option key={weight} value={weight}>{weight}%</option>)}</select></label><label className="space-y-1"><span className="text-[12px] font-medium text-[#86868B]">{c.taskType}</span><select value={newTaskType} onChange={(event) => setNewTaskType(event.target.value)} disabled={!selected} className="min-h-11 w-full rounded-[14px] border-0 bg-[#F5F5F7] px-4 text-[15px] font-medium outline-none focus:bg-white focus:ring-4 focus:ring-black/10 disabled:opacity-50">{TASK_TYPES.map((type) => <option key={type} value={type}>{labelFor(lang, "taskType", type)}</option>)}</select></label></div><Button onClick={addTask} className={!selected ? "opacity-50" : ""}><Plus className="h-4 w-4" /> {c.add}</Button><div className="rounded-[16px] bg-[#F5F5F7] p-4"><div className="mb-2 text-[14px] font-semibold text-[#1D1D1F]">{c.batchAdd}</div><p className="mb-3 text-[12px] leading-5 text-[#86868B]">{c.batchTip}</p><textarea value={batchText} onChange={(event) => setBatchText(event.target.value)} placeholder={c.batchPlaceholder} rows={5} className="w-full resize-none rounded-[14px] border-0 bg-white px-4 py-3 text-[14px] leading-6 outline-none transition placeholder:text-[#A1A1A6] focus:ring-4 focus:ring-black/10" /><Button onClick={addBatchTasks} variant="light" className="mt-3"><Plus className="h-4 w-4" /> {c.batchAdd}</Button></div></div>
        </Card>
      </div>
    );
  }

  if (activePage === "home") {
    return appShell(
      <main className="relative mx-auto max-w-6xl px-5 py-12 sm:px-8 lg:py-16">
        <header className="mb-12 max-w-3xl"><PixelBadge tone="blue">SoManyLanes</PixelBadge><h1 className="mt-6 text-[44px] font-medium leading-[1.02] tracking-[-0.05em] text-[#1D1D1F] sm:text-[72px]">{c.heroTitle}</h1><p className="mt-6 max-w-2xl text-[16px] leading-7 text-[#86868B] sm:text-[18px]">{c.heroDesc}</p></header>
        <section className="grid gap-6 md:grid-cols-2"><FeatureCard icon="🗺️" title={c.homeBoardTitle} description={c.homeBoardDesc} stat={`${activeProjects.length} lanes`} button={`${c.open} ${c.dashboard}`} onClick={() => setActivePage("dashboard")} /><FeatureCard icon="✅" title={c.homeNowTitle} description={c.homeNowDesc} stat={`${filteredNextSteps.length} steps`} button={`${c.open} ${c.now}`} onClick={() => setActivePage("now")} /><FeatureCard icon="💡" title={c.homeIdeaTitle} description={c.homeIdeaDesc} stat={`${activeIdeas.length} ideas`} button={`${c.open} ${c.ideas}`} onClick={() => setActivePage("ideas")} /><FeatureCard icon="🧺" title={c.homeTrashTitle} description={c.homeTrashDesc} stat={`${trashCount} items`} button={`${c.open} ${c.trash}`} onClick={() => setActivePage("trash")} /></section>
      </main>
    );
  }

  if (activePage === "ideas") {
    return appShell(
      <main className="relative mx-auto max-w-5xl px-5 py-12 sm:px-8 lg:py-16"><header className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"><div><h1 className="text-[42px] font-medium leading-[1.03] tracking-[-0.045em] sm:text-[64px]">{c.ideaTitle}</h1><p className="mt-5 max-w-xl text-[15px] leading-6 text-[#86868B] sm:text-[16px]">{c.ideaDesc}</p></div><PixelBadge tone="gold">{activeIdeas.length} ideas</PixelBadge></header><Card className="mb-8 p-5 sm:p-6"><div className="grid gap-3 sm:grid-cols-[1fr_160px_auto] sm:items-end"><div><div className="mb-1 text-[13px] font-medium text-[#86868B]">{c.quickIdea}</div><input value={thought} onChange={(event) => setThought(event.target.value)} onKeyDown={(event) => event.key === "Enter" && addThought()} placeholder={lang === "zh" ? "突然想到什么，先丢进这里..." : "Drop a quick thought here..."} className="min-h-12 w-full rounded-[14px] border-0 bg-[#F5F5F7] px-4 text-[15px] outline-none transition placeholder:text-[#A1A1A6] focus:bg-white focus:ring-4 focus:ring-black/10" /></div><select value={newIdeaCategory} onChange={(event) => setNewIdeaCategory(event.target.value)} className="min-h-12 rounded-[14px] border-0 bg-[#F5F5F7] px-4 text-[14px] font-medium text-[#6E6E73] outline-none focus:bg-white focus:ring-4 focus:ring-black/10">{IDEA_CATEGORIES.filter((category) => category !== "全部").map((category) => <option key={category} value={category}>{labelFor(lang, "ideaCategory", category)}</option>)}</select><Button onClick={addThought}><Plus className="h-4 w-4" /> {c.saveIdea}</Button></div></Card><Card className="p-5 sm:p-6"><div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-[22px] font-semibold tracking-[-0.02em]">{c.allIdeas}</h2><p className="mt-1 text-[13px] text-[#86868B]">{c.ideasHint}</p></div><div className="flex flex-col gap-2 sm:flex-row"><div className="flex rounded-full bg-[#F5F5F7] p-1"><button type="button" onClick={() => setIdeaView("list")} className={cx("rounded-full px-3 py-2 text-[13px] font-medium transition", ideaView === "list" ? "bg-white text-[#1D1D1F] shadow-sm" : "text-[#86868B]")}>{c.ideaViewList}</button><button type="button" onClick={() => setIdeaView("bubble")} className={cx("rounded-full px-3 py-2 text-[13px] font-medium transition", ideaView === "bubble" ? "bg-white text-[#1D1D1F] shadow-sm" : "text-[#86868B]")}>{c.ideaViewBubble}</button></div><select value={ideaCategoryFilter} onChange={(event) => setIdeaCategoryFilter(event.target.value)} className="min-h-11 rounded-full border-0 bg-[#F5F5F7] px-4 text-[14px] font-medium text-[#6E6E73] outline-none focus:bg-white focus:ring-4 focus:ring-black/10">{IDEA_CATEGORIES.map((category) => <option key={category} value={category}>{labelFor(lang, "ideaCategory", category)}</option>)}</select><div className="relative w-full sm:w-64"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A1A1A6]" /><input value={ideaSearch} onChange={(event) => setIdeaSearch(event.target.value)} placeholder={c.searchIdeas} className="min-h-11 w-full rounded-full border-0 bg-[#F5F5F7] pl-9 pr-4 text-[14px] outline-none transition placeholder:text-[#A1A1A6] focus:bg-white focus:ring-4 focus:ring-black/10" /></div></div></div>{ideaView === "bubble" ? <div className="flex flex-wrap gap-3">{filteredIdeas.map((idea) => <div key={idea.id} className="group inline-flex items-center gap-2 rounded-full bg-[#F5F5F7] px-4 py-2 text-[13px] text-[#3A3A3C] ring-1 ring-black/[0.04]"><span>{idea.text}</span><button type="button" onClick={() => deleteIdea(idea.id)} className="grid h-5 w-5 place-items-center rounded-full text-[#A1A1A6] opacity-0 transition group-hover:opacity-100 hover:bg-white hover:text-[#D93025]" aria-label="delete idea bubble">×</button></div>)}</div> : renderIdeaList(true)}</Card></main>
    );
  }

  if (activePage === "trash") {
    return appShell(
      <main className="relative mx-auto max-w-4xl px-5 py-12 sm:px-8 lg:py-16"><header className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"><div><h1 className="text-[42px] font-medium leading-[1.03] tracking-[-0.045em] sm:text-[64px]">{c.trashTitle}</h1><p className="mt-5 max-w-xl text-[15px] leading-6 text-[#86868B] sm:text-[16px]">{c.trashDesc}</p></div><PixelBadge tone="red">{trashCount} items</PixelBadge></header><div className="space-y-8"><Card className="p-5 sm:p-6"><div className="mb-5 flex items-center justify-between"><div><h2 className="text-[22px] font-semibold tracking-[-0.02em]">{c.deletedIdeas}</h2><p className="mt-1 text-[13px] text-[#86868B]">{c.restoreIdeaHint}</p></div><PixelBadge tone="neutral">{trashIdeas.length}</PixelBadge></div>{trashIdeas.length ? <div className="space-y-3">{trashIdeas.map((idea) => <div key={idea.id} className="rounded-[16px] bg-[#F5F5F7] p-4"><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><div className="text-[15px] font-semibold">{idea.text}</div><div className="mt-1 text-[12px] text-[#86868B]">{c.remaining} {daysLeftInTrash(idea)} {c.days} · {c.deletedAt} {formatTime(idea.deletedAt)}</div></div><div className="flex gap-2"><Button onClick={() => restoreIdea(idea.id)} variant="green"><RotateCcw className="h-4 w-4" /> {c.restore}</Button><Button onClick={() => permanentlyDeleteIdea(idea.id)} variant="light"><Trash2 className="h-4 w-4" /> {c.permanentDelete}</Button></div></div></div>)}</div> : <EmptyState>{c.noTrashIdeas}</EmptyState>}</Card><Card className="p-5 sm:p-6"><div className="mb-5 flex items-center justify-between"><div><h2 className="text-[22px] font-semibold tracking-[-0.02em]">{c.deletedProjects}</h2><p className="mt-1 text-[13px] text-[#86868B]">{c.restoreProjectHint}</p></div><PixelBadge tone="neutral">{trashProjects.length}</PixelBadge></div>{trashProjects.length ? <div className="space-y-3">{trashProjects.map((project) => <div key={project.id} className="rounded-[16px] bg-[#F5F5F7] p-4"><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div className="text-[15px] font-semibold">{project.title}</div><div className="flex gap-2"><Button onClick={() => restoreProject(project.id)} variant="green"><RotateCcw className="h-4 w-4" /> {c.restore}</Button><Button onClick={() => permanentlyDeleteProject(project.id)} variant="light"><Trash2 className="h-4 w-4" /> {c.permanentDelete}</Button></div></div></div>)}</div> : <EmptyState>{c.noTrashProjects}</EmptyState>}</Card><Card className="p-5 sm:p-6"><div className="mb-5 flex items-center justify-between"><div><h2 className="text-[22px] font-semibold tracking-[-0.02em]">{c.deletedTasks}</h2><p className="mt-1 text-[13px] text-[#86868B]">{c.restoreTaskHint}</p></div><PixelBadge tone="neutral">{trashTasks.length}</PixelBadge></div>{trashTasks.length ? <div className="space-y-3">{trashTasks.map(({ project, task }) => <div key={`${project.id}-${task.id}`} className="rounded-[16px] bg-[#F5F5F7] p-4"><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><PixelBadge tone="blue">{project.title}</PixelBadge><div className="mt-2 text-[15px] font-semibold">{task.title}</div></div><div className="flex gap-2"><Button onClick={() => restoreTask(project.id, task.id)} variant="green"><RotateCcw className="h-4 w-4" /> {c.restore}</Button><Button onClick={() => permanentlyDeleteTask(project.id, task.id)} variant="light"><Trash2 className="h-4 w-4" /> {c.permanentDelete}</Button></div></div></div>)}</div> : <EmptyState>{c.noTrashTasks}</EmptyState>}</Card></div></main>
    );
  }

  if (activePage === "now") {
    return appShell(
      <main className="relative mx-auto max-w-5xl px-5 py-12 sm:px-8 lg:py-16"><header className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"><div><h1 className="text-[42px] font-medium leading-[1.03] tracking-[-0.045em] sm:text-[64px]">{c.nowTitle}</h1><p className="mt-5 max-w-xl text-[15px] leading-6 text-[#86868B] sm:text-[16px]">{c.nowDesc}</p></div><PixelBadge tone="green">{filteredNextSteps.length} steps</PixelBadge></header><Card className="mb-8 p-4 sm:p-5"><div className="flex flex-wrap gap-2">{[["active", c.filters.active], ["all", c.filters.all], ["boss", c.filters.boss], ["sealed", c.filters.sealed]].map(([value, label]) => <button key={value} type="button" onClick={() => setNextFilter(value)} className={cx("rounded-full px-4 py-2 text-[14px] font-medium transition focus:outline-none focus:ring-4 focus:ring-black/10", nextFilter === value ? "bg-[#1D1D1F] text-white" : "bg-[#F5F5F7] text-[#6E6E73] hover:bg-[#ECECEF]")}>{label}</button>)}</div></Card>{filteredNextSteps.length ? <div className="grid gap-5">{filteredNextSteps.map(({ project, task, progress: itemProgress }) => { const pt = tintMap[project.tint] || tintMap.blue; return <Card key={`${project.id}-${task.id}`} draggable onDragStart={() => setDraggingProjectId(project.id)} onDragOver={(event) => event.preventDefault()} onDrop={() => { reorderProjectById(draggingProjectId, project.id); setDraggingProjectId(null); }} className="p-5 sm:p-6"><div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between"><div className="flex min-w-0 flex-1 gap-4"><div className="mt-2 grid h-8 w-5 shrink-0 cursor-grab place-items-center rounded-full text-[14px] text-[#C7C7CC] active:cursor-grabbing">⋮⋮</div><PixelIcon className={cx("h-12 w-12 rounded-xl text-2xl", pt.bg)}>{project.icon}</PixelIcon><div className="min-w-0 flex-1"><div className="mb-2 flex flex-wrap items-center gap-2"><PixelBadge tone={project.paused ? "neutral" : "blue"}>{project.paused ? c.statusSealed : c.statusActive}</PixelBadge>{project.stuck && <PixelBadge tone="red">⛓ {c.rescue}</PixelBadge>}<PixelBadge tone={task.type === "BOSS" ? "red" : "gold"}>{labelFor(lang, "taskType", task.type)}</PixelBadge><span className="text-[13px] text-[#86868B]">{project.title}</span></div><h2 className="text-[22px] font-semibold tracking-[-0.02em]">{task.title}</h2><p className="mt-2 text-[15px] leading-7 text-[#6E6E73]">{task.action}</p>{task.focusMode && <div className="mt-4 rounded-[16px] bg-[#FFF8E7] p-4 ring-1 ring-[#FFD60A]/25"><div className="mb-1 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between"><div className="text-[13px] font-semibold text-[#8A6400]">{c.fiveMinuteLabel}</div><div className="text-[12px] text-[#A37A00]">{c.fiveMinuteHint}</div></div><textarea value={task.focusAction || ""} onChange={(event) => updateTaskFocusAction(project.id, task.id, event.target.value)} rows={2} className="mt-2 w-full resize-none rounded-[12px] border-0 bg-white/70 px-3 py-2 text-[14px] leading-6 text-[#6E5B20] outline-none transition focus:ring-4 focus:ring-[#FFD60A]/20" /></div>}<div className="mt-4 flex items-center gap-3 text-[12px] text-[#9A9AA0]"><span className="w-9 tabular-nums">{itemProgress}%</span><div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#E5E5EA]"><div className={cx("h-full rounded-full", pt.bar)} style={{ width: `${itemProgress}%` }} /></div></div></div></div><div className="grid shrink-0 grid-cols-1 gap-2 sm:w-40"><Button onClick={() => completeTask(project.id, task.id)} variant="green" className="w-full"><Check className="h-4 w-4" /> {c.complete}</Button><Button onClick={() => { setSelectedId(project.id); setActivePage("dashboard"); }} variant="light" className="w-full">{c.enterProject}</Button><button type="button" onClick={() => toggleFiveMinute(project.id, task.id)} className={cx("min-h-10 rounded-full px-3 text-[13px] font-medium transition focus:outline-none focus:ring-4 focus:ring-black/10", task.focusMode ? "bg-[#FFF8E7] text-[#8A6400] ring-1 ring-[#FFD60A]/25 hover:bg-[#FFF3C4]" : "bg-[#F5F5F7] text-[#6E6E73] hover:bg-[#ECECEF]")}>{task.focusMode ? c.cancelTiny : c.tiny}</button></div></div></Card>; })}</div> : <EmptyState>{c.noNow}</EmptyState>}</main>
    );
  }

  return appShell(
    <main className="relative mx-auto max-w-6xl px-5 py-12 sm:px-8 lg:py-16"><header className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"><div className="max-w-2xl"><h1 className="text-[42px] font-medium leading-[1.03] tracking-[-0.045em] text-[#1D1D1F] sm:text-[60px]">{c.boardTitle}</h1><p className="mt-5 max-w-3xl truncate text-[15px] leading-6 text-[#86868B] sm:text-[16px]">{c.boardDesc}</p></div></header><section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start"><div className="space-y-8"><Card className="p-7 sm:p-8">{selected ? <><div className="mb-8 grid gap-5 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-start"><PixelIcon className={tint.bg}>{selected.icon}</PixelIcon><div className="min-w-0 w-full"><div className="mb-3 flex flex-wrap items-center gap-2"><PixelBadge tone="blue" title={c.dungeonHint}>Dungeon</PixelBadge><PixelBadge tone="gold" title={c.levelHint}>Lv.{selected.level}</PixelBadge>{selected.paused && <PixelBadge tone="neutral" title={c.sealedBadgeHint}>sealed</PixelBadge>}{selected.stuck && <PixelBadge tone="red">⛓ {c.rescue}</PixelBadge>}</div>{editingProjectId === selected.id ? <input value={draftTitle} onChange={(event) => setDraftTitle(event.target.value)} onBlur={commitRename} onKeyDown={(event) => { if (event.key === "Enter") commitRename(); if (event.key === "Escape") { setEditingProjectId(null); setDraftTitle(""); } }} autoFocus className="w-full max-w-sm rounded-xl bg-[#F5F5F7] px-3 py-2 text-[28px] font-medium leading-tight tracking-[-0.028em] outline-none ring-1 ring-black/[0.06] focus:bg-white focus:ring-4 focus:ring-black/10" /> : <div className="flex items-center gap-2"><h2 className="text-[28px] font-medium leading-tight tracking-[-0.028em]">{selected.title}</h2><button type="button" onClick={() => startRename(selected)} className="grid h-8 w-8 place-items-center rounded-full text-[#A1A1A6] transition hover:bg-[#F5F5F7] hover:text-[#1D1D1F] focus:outline-none focus:ring-4 focus:ring-black/10" aria-label="rename dungeon"><Pencil className="h-4 w-4" /></button></div>}<input value={selected.subtitle || ""} onChange={(event) => updateProjectField(selected.id, "subtitle", event.target.value)} className="mt-1.5 block h-10 w-full rounded-[12px] border-0 bg-[#F5F5F7] px-3 text-[14px] font-normal text-[#86868B] outline-none transition focus:bg-white focus:ring-4 focus:ring-black/10" /></div><div className="flex gap-2"><Button onClick={toggleJailSelected} variant="light" disabled={selected.paused} className={selected.paused ? "opacity-50" : ""}><Lock className="h-4 w-4" /> {selected.stuck ? c.closeJail : c.rescue}</Button><Button onClick={toggleSealSelected} variant="light" title={c.sealHint}><Pause className="h-4 w-4" /> {selected.paused ? c.unseal : c.seal}</Button></div></div><div className="rounded-[18px] bg-gradient-to-br from-[#F7F8FB] via-[#F5F5F7] to-[#EAF4FF] p-6 ring-1 ring-black/[0.04]"><div className="grid gap-5 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-end"><div className="shrink-0"><div className="text-[13px] font-medium uppercase tracking-wide text-[#86868B]">Progress</div><div className="mt-1 text-[48px] font-semibold tracking-[-0.05em]">{progress}%</div></div><div className="rounded-[14px] bg-white/70 p-3 ring-1 ring-black/[0.04]"><div className="mb-2 flex items-center justify-between text-[11px] font-medium uppercase tracking-wide text-[#A1A1A6]"><span>0</span><span>{progress}% cleared</span><span>100</span></div><div className="h-3 overflow-hidden rounded-full bg-[#E5E5EA]"><div className={cx("h-full rounded-full", tint.bar)} style={{ width: `${progress}%` }} /></div></div></div></div>{selected.paused && <div className="mt-6 rounded-[16px] bg-[#F5F5F7] p-5 ring-1 ring-black/[0.04]"><div className="text-[15px] font-semibold text-[#1D1D1F]">{c.sealedPanelTitle}</div><p className="mt-2 text-[14px] leading-6 text-[#86868B]">{c.sealedPanelDesc}</p></div>}</> : <EmptyState><div className="text-3xl">🗺️</div><h2 className="mt-3 text-[22px] font-semibold tracking-[-0.02em]">{c.noProject}</h2><p className="mt-2">{c.noProjectDesc}</p></EmptyState>}</Card>{selected?.stuck && !selected.paused && <Card className="overflow-hidden bg-white p-0 ring-1 ring-[#FF453A]/10"><div className="border-b border-[#FF453A]/10 bg-[#FFF1EF] px-6 py-5"><div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div className="flex min-w-0 flex-1 gap-4"><PixelIcon className="bg-white text-[#D93025]">⛓️</PixelIcon><div className="min-w-0 flex-1"><div className="mb-2 flex flex-wrap items-center gap-2"><PixelBadge tone="red">{c.rescue}</PixelBadge><PixelBadge tone="neutral">Lv.{selected.level}</PixelBadge></div><div className="text-[22px] font-semibold tracking-[-0.02em] text-[#1D1D1F]">{c.rescueMode}</div><p className="mt-2 max-w-2xl text-[14px] leading-6 text-[#6E6E73]">{c.rescueDesc}</p></div></div><Button onClick={toggleJailSelected} variant="light" className="shrink-0">{c.closeJail}</Button></div></div><div className="grid gap-4 p-6 lg:grid-cols-2"><label className="block"><span className="mb-2 block text-[13px] font-semibold text-[#1D1D1F]">{c.jailReasonTitle}</span><textarea value={selected.stuckReason || ""} onChange={(event) => updateProjectField(selected.id, "stuckReason", event.target.value)} placeholder={c.jailReasonPlaceholder} rows={4} className="w-full resize-none rounded-[16px] border-0 bg-[#F5F5F7] px-4 py-3 text-[14px] leading-6 text-[#3A3A3C] outline-none transition focus:bg-white focus:ring-4 focus:ring-[#FF453A]/10" /></label><label className="block"><span className="mb-2 block text-[13px] font-semibold text-[#1D1D1F]">{c.jailPlanTitle}</span><textarea value={selected.stuckPlan || ""} onChange={(event) => updateProjectField(selected.id, "stuckPlan", event.target.value)} placeholder={c.jailPlanPlaceholder} rows={4} className="w-full resize-none rounded-[16px] border-0 bg-[#F5F5F7] px-4 py-3 text-[14px] leading-6 text-[#3A3A3C] outline-none transition focus:bg-white focus:ring-4 focus:ring-[#FF453A]/10" /></label></div><div className="mx-6 mb-6 rounded-[16px] bg-[#F5F5F7] px-4 py-3 text-[13px] leading-6 text-[#6E6E73]">{c.jailTip}</div></Card>}<Card className="p-7 sm:p-8"><div className="mb-7 flex items-end justify-between gap-4"><div><h3 className="text-[22px] font-medium tracking-[-0.025em]">{c.questLog}</h3><p className="mt-1.5 text-[13px] font-normal text-[#86868B]">{c.questLogDesc}</p></div><button type="button" onClick={() => setTaskModalOpen(true)} className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#1D1D1F] text-white shadow-sm transition hover:bg-black focus:outline-none focus:ring-4 focus:ring-black/10" aria-label="add task node"><Plus className="h-5 w-5" /></button></div>{selected && orderedTasksOf(selected).length ? <div className="divide-y divide-black/[0.06]">{orderedTasksOf(selected).map((task) => { const isBoss = task.type === "BOSS"; const tone = task.done ? "green" : isBoss ? "red" : "blue"; return <div key={task.id} draggable onDragStart={() => selected && setDraggingTask({ projectId: selected.id, taskId: task.id })} onDragOver={(event) => event.preventDefault()} onDrop={() => { if (selected && draggingTask?.projectId === selected.id) reorderTaskInProject(selected.id, draggingTask.taskId, task.id); setDraggingTask(null); }} className="group flex w-full gap-3 py-5 text-left transition first:pt-0 last:pb-0"><div className="mt-1 grid h-8 w-5 shrink-0 cursor-grab place-items-center rounded-full text-[14px] text-[#C7C7CC] active:cursor-grabbing">⋮⋮</div><button type="button" onClick={() => completeTask(selected.id, task.id)} className={cx("mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full transition focus:outline-none focus:ring-4 focus:ring-black/10", task.done ? "bg-[#34C759] text-white" : "bg-[#F5F5F7] text-[#8E8E93] group-hover:bg-[#ECECEF]")}>{task.done ? <Check className="h-4 w-4" /> : <Circle className="h-4 w-4" />}</button><div className="min-w-0 flex-1"><div className="mb-2 flex flex-wrap items-center gap-2"><PixelBadge tone={tone}>{labelFor(lang, "taskType", task.type)}</PixelBadge><PixelBadge tone="gold">+{task.weight}%</PixelBadge></div><div className={cx("text-[17px] font-semibold tracking-[-0.015em]", task.done && "text-[#34A853] line-through")}>{task.title}</div><textarea data-autosize="true" value={task.action || ""} onChange={(event) => selected && handleTaskActionChange(selected.id, task.id, event)} rows={1} className="mt-2 min-h-10 w-full resize-none overflow-hidden rounded-[12px] border-0 bg-[#F5F5F7] px-3 py-2 text-[13px] leading-5 text-[#6E6E73] outline-none transition focus:bg-white focus:ring-4 focus:ring-black/10" placeholder={c.nodeDescPlaceholder} />{task.focusMode && <div className="mt-2 rounded-[14px] bg-[#FFF8E7] p-3 ring-1 ring-[#FFD60A]/25"><div className="mb-1 text-[12px] font-semibold text-[#8A6400]">{c.fiveMinuteLabel}</div><textarea value={task.focusAction || ""} onChange={(event) => selected && updateTaskFocusAction(selected.id, task.id, event.target.value)} rows={2} className="w-full resize-none rounded-[10px] border-0 bg-white/60 px-3 py-2 text-[13px] leading-5 text-[#6E5B20] outline-none focus:ring-4 focus:ring-[#FFD60A]/20" /></div>}</div><button type="button" onClick={() => selected && deleteTask(selected.id, task.id)} className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full text-[#A1A1A6] transition hover:bg-[#F5F5F7] hover:text-[#D93025] focus:outline-none focus:ring-4 focus:ring-black/10"><Trash2 className="h-4 w-4" /></button></div>; })}</div> : <EmptyState>{c.noTasks}</EmptyState>}</Card></div><aside className="space-y-8">{renderProjectSwitcher()}</aside></section>{renderAddTaskModal()}{renderProjectManagerModal()}</main>
  );
}
