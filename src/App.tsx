import React, { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Archive,
  ArrowRight,
  BookOpen,
  Check,
  CheckSquare,
  ChevronRight,
  Circle,
  CircleAlert,
  Flag,
  Folder,
  Home,
  Layers,
  Lightbulb,
  MoreHorizontal,
  PauseCircle,
  Pencil,
  PlayCircle,
  Plus,
  RefreshCw,
  RotateCcw,
  Search,
  StickyNote,
  Target,
  Trash2,
} from "lucide-react";

const PROJECTS_KEY = "somanylanes-projects-v7";
const IDEAS_KEY = "somanylanes-ideas-v7";
const ACTIVITY_DAYS_KEY = "somanylanes-activity-days-v1";
const TRASH_RETENTION_DAYS = 60;
const DAY_MS = 24 * 60 * 60 * 1000;

const IDEA_CATEGORIES = ["全部", "灵感", "产品", "学习", "生活", "工作"];
const PROJECT_CATEGORIES = ["个人项目", "工作项目", "学习项目", "生活项目", "创意项目", "其他"];
const TASK_TYPES = ["普通任务", "核心任务", "辅助任务", "探索任务", "学习任务", "沟通任务", "复盘任务", "重点任务", "里程碑"];
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
    小怪: "Small task",
    史莱姆: "Low-pressure task",
    哥布林: "Errand",
    骷髅兵: "Routine task",
    精英怪: "Priority task",
    支线: "Support task",
    主线: "Core task",
    探索: "Research",
    训练: "Practice",
    BOSS: "Milestone",
    普通任务: "General task",
    核心任务: "Core task",
    辅助任务: "Support task",
    探索任务: "Research",
    学习任务: "Learning task",
    沟通任务: "Communication",
    复盘任务: "Review",
    重点任务: "Priority task",
    里程碑: "Milestone",
  },
};

const zhLabelMaps = {
  taskType: {
    小怪: "小任务",
    史莱姆: "低压任务",
    哥布林: "杂事任务",
    骷髅兵: "重复任务",
    精英怪: "重点任务",
    支线: "辅助任务",
    主线: "核心任务",
    探索: "探索任务",
    训练: "练习任务",
    BOSS: "里程碑",
    普通任务: "普通任务",
    核心任务: "核心任务",
    辅助任务: "辅助任务",
    探索任务: "探索任务",
    学习任务: "学习任务",
    沟通任务: "沟通任务",
    复盘任务: "复盘任务",
    重点任务: "重点任务",
    里程碑: "里程碑",
  },
};

function labelFor(lang, group, value) {
  if (lang === "zh") return zhLabelMaps[group]?.[value] || value;
  return labelMaps[group]?.[value] || value;
}

function isMilestoneTask(type) {
  return type === "BOSS" || type === "里程碑" || type === "Milestone";
}

const copyMap = {
  zh: {
    brand: "SoManyLanes",
    home: "首页",
    dashboard: "项目",
    ideas: "随手记",
    now: "现在就做",
    trash: "回收站",
    languageButton: "EN",
    savedLocal: "已保存到本机",
    morningGreeting: "👋 早上好，Alex",
    heroTitle: "今天你填坑了吗？",
    heroDesc: "ADHD 友好的多项目管理器!!! 你还有多少个坑同时开着......",
    homeBoardTitle: "项目",
    homeBoardDesc: "管理当前项目、切换项目、调整任务顺序、推进进度。",
    homeNowTitle: "现在就做",
    homeNowDesc: "每个项目当前可做的一小步，你可以直接完成，或先做 5 分钟。",
    homeIdeaTitle: "随手记",
    homeIdeaDesc: "想到什么就记下来，先保护前额叶。",
    homeTrashTitle: "回收站",
    homeTrashDesc: "想法、项目、任务删除后保留 60 天，可恢复。",
    todayOverview: "今天概览",
    todayOverviewDesc: "快速看一下今天的重点，保持节奏感。",
    customizeLayout: "自定义布局",
    continueFive: "继续做 5 分钟",
    switchTask: "换一条",
    currentProject: "当前项目",
    viewDetails: "查看详情",
    recentIdeas: "最近随手记",
    allQuickNotes: "全部随手记",
    blockerReminder: "卡住提醒",
    handleBlocker: "去处理",
    noBlocker: "暂无卡住项目，节奏不错。",
    blockerHistory: "卡住记录",
    blockerResolvedAt: "解决于",
    noBlockerHistory: "还没有已解决的卡住记录。",
    deleteRecord: "删除记录",
    noOverviewTask: "现在没有可推进的下一步。",
    homeHint: "不是所有坑都要立刻填完，先走一步，坑会自己变少。",
    open: "进入",
    boardTitle: "项目",
    boardDesc: "项目页用于推进当前项目：查看进度、管理任务、调整顺序，把注意力留给真正重要的事情。",
    ideaTitle: "随手记",
    ideaDesc: "想到什么就记下来，先保护前额叶。",
    nowTitle: "现在就做",
    nowDesc: "每个项目当前可做的一小步，你可以直接完成，或先做 5 分钟。",
    trashTitle: "回收站",
    trashDesc: "删除的想法、项目和任务会先放在这里，保留 60 天。你可以恢复，也可以永久删除。",
    quickIdea: "随手记",
    saveIdea: "保存想法",
    searchIdeas: "搜索想法",
    allIdeas: "全部想法",
    ideasHint: "想到什么就记下来，先保护前额叶。",
    convertToProject: "转为项目",
    deletedIdeas: "想法",
    deletedProjects: "项目",
    deletedTasks: "任务",
    restore: "恢复",
    permanentDelete: "永久删除",
    remaining: "剩余",
    days: "天",
    deletedAt: "删除于",
    addNode: "新增任务",
    addNodeDesc: "给当前项目添加一个新的任务，也可以批量粘贴任务列表。",
    nodeNamePlaceholder: "任务名称，比如：写产品页标题",
    nodeDescPlaceholder: "任务描述，比如：写出可操作的一步，不求完整。",
    add: "加入",
    batchAdd: "批量加入",
    batchPlaceholder: "批量粘贴任务，每行一个：任务名称｜任务描述｜进度数字｜类型",
    batchTip: "每行用｜分隔。未填写进度或类型时，将使用默认值。",
    taskWeight: "进度比例",
    taskType: "任务类型",
    questLog: "任务清单",
    questLogDesc: "点一下圆圈完成任务，描述可以直接编辑。已完成任务会自动沉到底部。",
    projectLabel: "项目",
    insightsWeeklyPlan: "统计分析 & 日历视图",
    insightsWeeklyPlanDesc: "基于当前项目的任务状态，轻量看一眼推进情况。",
    totalTasks: "总任务",
    completedTasks: "已完成",
    inProgressTasks: "进行中",
    notStartedTasks: "待开始",
    completionRate: "完成比例",
    completedTrend: "完成趋势（7天）",
    thisWeek: "本周视图",
    weeklyPlan: "本周视图",
    weeklyPlanEmpty: "在任务清单里点“日期”后，这里会显示你的本周安排。",
    scheduledTasks: "个任务",
    restDay: "休息",
    prevWeek: "上一周",
    nextWeek: "下一周",
    progressCleared: "已推进",
    taskDate: "日期",
    noTaskDate: "日期",
    scheduleDate: "安排日期",
    clearDate: "清除日期",
    editTaskMeta: "编辑",
    rescue: "卡住",
    closeJail: "恢复推进",
    rescueMode: "卡关处理",
    rescueDesc: "适合卡住时候用：记录卡住原因 + 思考解决办法。",
    jailReasonPlaceholder: "写下卡住原因，比如：不知道先做哪一步 / 信息太多 / 怕做得不好 / 需要别人确认...",
    jailReasonTitle: "卡住原因",
    jailPlanTitle: "解决办法",
    jailPlanPlaceholder: "先写一个最小解决办法，比如：问谁 / 查哪条资料 / 先做哪个最小动作。",
    jailTip: "先别急着推进，把卡住的原因写出来，脑子就会少占一个后台进程。",
    seal: "暂停",
    unseal: "恢复",
    sealHint: "暂停 = 暂时停靠这个项目。它不会被删除，但会从“现在就做”和推进流里隐藏，避免你被太多任务同时拉扯。",
    sealedPanelTitle: "这个项目已暂停",
    sealedPanelDesc: "先不用管它。等你想重新推进时，点“恢复”再继续。",
    project: "项目管理",
    projectHint: "切换 / 新增 / 删除项目都放在这里。卡住的项目自动置顶，已暂停的项目自动沉底，也可以拖动排序。",
    addProjectPlaceholder: "新增项目名称",
    projectType: "项目类型",
    projectLevel: "复杂度",
    filters: { active: "进行中", all: "全部", boss: "里程碑", sealed: "已暂停" },
    readyTasks: "可开始任务",
    streakDays: "连续行动",
    dayUnit: "天",
    currentFocusTask: "当前重点任务",
    taskStatus: "当前状态",
    projectProgress: "项目进度",
    todaySuggestion: "今日建议",
    oneFiveMinute: "1 个 5 分钟",
    otherReadyTasks: "其他可开始任务",
    whyFiveTitle: "为什么先做 5 分钟？",
    whyFiveItems: [
      ["降低启动压力", "先开始，不要求一次完成。"],
      ["建立行动惯性", "开始以后，更容易继续推进。"],
      ["保护注意力", "先处理眼前的一小步，不被整个项目压住。"],
    ],
    whyFiveHint: "开始得越小，走得越远。",
    noOtherReadyTasks: "当前筛选下没有其他可开始任务。",
    statusActive: "进行中",
    statusSealed: "已暂停",
    statusArchived: "已归档",
    archive: "归档",
    unarchive: "移出归档",
    archiveHint: "项目完成 100% 后可以归档，归档后会从默认推进流里隐藏。",
    archivedProjects: "归档项目",
    complete: "完成",
    enterProject: "进入项目",
    tiny: "先做5分钟",
    cancelTiny: "可以了",
    fiveMinuteLabel: "先做5分钟",
    fiveMinuteHint: "80% 以上的人都会在 5 分钟后继续做下去。",
    close: "关闭",
    emptyIdeas: "这里还没有匹配的想法。",
    noProject: "还没有项目",
    noProjectDesc: "先在右侧新建一个项目，再添加任务。",
    noTasks: "当前项目还没有任务。",
    noNow: "暂时没有下一步。可能所有项目都完成或已暂停。",
    noTrashIdeas: "没有被删除的想法。",
    noTrashProjects: "没有被删除的项目。",
    noTrashTasks: "没有被删除的任务。",
    restoreTaskHint: "删除的任务会回到原项目里。",
    restoreProjectHint: "删除的项目会完整保留，60 天内可恢复。",
    restoreIdeaHint: "删除的想法会保留 60 天，恢复后回到随手记。",
    dungeonHint: "Project = 一个完整项目，也就是一条独立推进线。",
    levelHint: "复杂度表示项目的推进难度，可在新增项目时设定。",
    sealedBadgeHint: "paused = 已暂停，暂时停靠，不进入默认推进流。",
    manageProjects: "扩展管理",
    manageProjectsDesc: "在这里集中编辑项目命名、类型、复杂度和备注，也可以按标签筛选查看。",
    projectNote: "项目备注",
    allProjectTypes: "全部类型",
    ideaViewList: "列表",
    ideaViewBubble: "泡泡",
  },
  en: {
    brand: "SoManyLanes",
    home: "Home",
    dashboard: "Projects",
    ideas: "Quick Notes",
    now: "Do It Now",
    trash: "Trash",
    languageButton: "中文",
    savedLocal: "Saved locally",
    morningGreeting: "👋 Good morning, Alex",
    heroTitle: "Did you fill a pit today?",
    heroDesc: "An ADHD-friendly multi-project manager that helps you keep a steady rhythm even when many projects are open.",
    homeBoardTitle: "Projects",
    homeBoardDesc: "Manage current projects, switch lanes, adjust task order, and keep progress moving.",
    homeNowTitle: "Do It Now",
    homeNowDesc: "One small step from each project. Complete it, or just give it five minutes.",
    homeIdeaTitle: "Quick Notes",
    homeIdeaDesc: "Capture whatever pops up, and protect your prefrontal cortex.",
    homeTrashTitle: "Trash",
    homeTrashDesc: "Deleted ideas, projects, and tasks stay here for 60 days.",
    todayOverview: "Today overview",
    todayOverviewDesc: "A quick scan of what matters today, so the rhythm stays visible.",
    customizeLayout: "Customize layout",
    continueFive: "Continue 5 min",
    switchTask: "Switch",
    currentProject: "Current project",
    viewDetails: "View details",
    recentIdeas: "Recent quick notes",
    allQuickNotes: "All quick notes",
    blockerReminder: "Blocker reminder",
    handleBlocker: "Review blocker",
    noBlocker: "No blocked projects. Nice rhythm.",
    blockerHistory: "Blocker history",
    blockerResolvedAt: "Resolved at",
    noBlockerHistory: "No resolved blocker records yet.",
    deleteRecord: "Delete record",
    noOverviewTask: "No next step right now.",
    homeHint: "Not every pit needs to be filled today. Take one step, and the list gets lighter.",
    open: "Open",
    boardTitle: "Projects",
    boardDesc: "Use this page to review progress, manage tasks, reorder work, and focus on what matters most.",
    ideaTitle: "Quick Notes",
    ideaDesc: "Capture whatever pops up, and protect your prefrontal cortex.",
    nowTitle: "Do It Now",
    nowDesc: "One small step you can do right now. Complete it, or simply start for 5 minutes.",
    trashTitle: "Trash",
    trashDesc: "Deleted ideas, projects, and tasks stay here for 60 days. You can restore or permanently delete them.",
    quickIdea: "Quick capture",
    saveIdea: "Save idea",
    searchIdeas: "Search ideas",
    allIdeas: "All ideas",
    ideasHint: "Capture whatever pops up, and protect your prefrontal cortex.",
    convertToProject: "Turn into project",
    deletedIdeas: "Ideas",
    deletedProjects: "Projects",
    deletedTasks: "Tasks",
    restore: "Restore",
    permanentDelete: "Delete forever",
    remaining: "Left",
    days: "days",
    deletedAt: "Deleted at",
    addNode: "Add task",
    addNodeDesc: "Add a new task to the current project, or paste tasks in bulk.",
    nodeNamePlaceholder: "Task name, e.g. write product page title",
    nodeDescPlaceholder: "Task description, e.g. write one actionable step.",
    add: "Add",
    batchAdd: "Batch add",
    batchPlaceholder: "Paste tasks in bulk, one per line: title｜description｜progress number｜type",
    batchTip: "Use ｜ to split each line. Missing progress or type will use defaults.",
    taskWeight: "Progress share",
    taskType: "Task type",
    questLog: "Task List",
    questLogDesc: "Tap the circle to complete. Descriptions are editable. Completed tasks move to the bottom.",
    projectLabel: "Project",
    insightsWeeklyPlan: "Insights & Calendar",
    insightsWeeklyPlanDesc: "A light read on progress based on the current project's task state.",
    totalTasks: "Total tasks",
    completedTasks: "Completed",
    inProgressTasks: "In progress",
    notStartedTasks: "Not started",
    completionRate: "Completion rate",
    completedTrend: "Completed Trend (7 days)",
    thisWeek: "This Week",
    weeklyPlan: "This Week",
    weeklyPlanEmpty: "Click Date in the task list to see your weekly plan here.",
    scheduledTasks: "tasks",
    restDay: "Rest",
    prevWeek: "Previous week",
    nextWeek: "Next week",
    progressCleared: "cleared",
    taskDate: "Date",
    noTaskDate: "Date",
    scheduleDate: "Schedule date",
    clearDate: "Clear date",
    editTaskMeta: "Edit",
    rescue: "Blocked",
    closeJail: "Resume",
    rescueMode: "Blocker review",
    rescueDesc: "Use this when blocked: record the blocker and think through a possible next move.",
    jailReasonPlaceholder: "Write the blocker: too many options / unclear first step / waiting for someone / afraid it will be bad...",
    jailReasonTitle: "Blocker",
    jailPlanTitle: "Solution",
    jailPlanPlaceholder: "Write one tiny way out: who to ask / what to check / which smallest action to try.",
    jailTip: "Do not force progress yet. Name the blocker first, then the brain has one less background process.",
    seal: "Pause",
    unseal: "Resume",
    sealHint: "Pause = temporarily park this project. It is not deleted, but hidden from Do It Now and default prompts.",
    sealedPanelTitle: "This project is paused",
    sealedPanelDesc: "You do not need to touch it now. Resume it when you are ready to continue.",
    project: "Project management",
    projectHint: "Switch, create, delete, and reorder projects here. Blocked items rise, paused items sink.",
    addProjectPlaceholder: "New project name",
    projectType: "Project type",
    projectLevel: "Complexity",
    filters: { active: "Active", all: "All", boss: "Milestones", sealed: "Paused" },
    readyTasks: "Ready tasks",
    streakDays: "Action streak",
    dayUnit: "days",
    currentFocusTask: "Current focus task",
    taskStatus: "Current status",
    projectProgress: "Project progress",
    todaySuggestion: "Today suggestion",
    oneFiveMinute: "1 five-minute start",
    otherReadyTasks: "Other ready tasks",
    whyFiveTitle: "Why start with 5 minutes?",
    whyFiveItems: [
      ["Reduce startup pressure", "Begin first, without needing to finish everything."],
      ["Build action momentum", "Once you start, continuing gets easier."],
      ["Protect attention", "Work on one visible step instead of carrying the whole project."],
    ],
    whyFiveHint: "A smaller start makes progress easier.",
    noOtherReadyTasks: "No other ready tasks in this filter.",
    statusActive: "Active",
    statusSealed: "Paused",
    statusArchived: "Archived",
    archive: "Archive",
    unarchive: "Unarchive",
    archiveHint: "When a project reaches 100%, archive it to hide it from the default progress flow.",
    archivedProjects: "Archived projects",
    complete: "Complete",
    enterProject: "Open project",
    tiny: "Start 5 min",
    cancelTiny: "Done for now",
    fiveMinuteLabel: "Start 5 min",
    fiveMinuteHint: "Over 80% of people keep going after the first 5 minutes.",
    close: "Close",
    emptyIdeas: "No matching ideas yet.",
    noProject: "No project yet",
    noProjectDesc: "Create one on the right, then add tasks.",
    noTasks: "This project has no active tasks yet.",
    noNow: "No next step. Everything may be done or paused.",
    noTrashIdeas: "No deleted ideas.",
    noTrashProjects: "No deleted projects.",
    noTrashTasks: "No deleted tasks.",
    restoreTaskHint: "Deleted tasks return to their original project.",
    restoreProjectHint: "Deleted projects are kept for 60 days.",
    restoreIdeaHint: "Deleted ideas are kept for 60 days and return to Quick Notes when restored.",
    dungeonHint: "Project = a standalone project lane.",
    levelHint: "Complexity indicates the difficulty of a project. Set it when creating a project.",
    sealedBadgeHint: "paused = parked for now, hidden from the default push flow.",
    manageProjects: "Manage",
    manageProjectsDesc: "Edit project name, type, complexity and notes in one place. Filter by tag/category.",
    projectNote: "Project note",
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
    icon: "📁",
    title: "独立站上线",
    subtitle: "把独立站从想法推进到上线",
    note: "",
    status: "推进中",
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
    icon: "📘",
    title: "雅思备考",
    subtitle: "低压刷题，不靠硬扛",
    note: "",
    status: "轻量练习",
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
    icon: "🗂️",
    title: "生活整理",
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
  { id: "idea-1", text: "给任务加一个卡住按钮", category: "产品", createdAt: "2026-05-19T10:00:00.000Z", deletedAt: null },
  { id: "idea-2", text: "首页要像干净的任务台，不要像游戏界面", category: "产品", createdAt: "2026-05-19T10:01:00.000Z", deletedAt: null },
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

function taskDateValue(task) {
  const value = task.scheduledDate || task.completedAt || task.createdAt;
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function sameCalendarDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function weeklyTaskBuckets(tasks) {
  const datedTasks = tasks.map((task) => ({ task, date: task.scheduledDate ? taskDateValue(task) : null })).filter((item) => item.date);
  if (!datedTasks.length) return [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(today);
  start.setDate(today.getDate() - 6);
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    const count = datedTasks.filter((item) => sameCalendarDay(item.date, date)).length;
    return { label: `${date.getMonth() + 1}/${date.getDate()}`, count };
  });
}

function startOfWeek(offset = 0) {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - date.getDay() + offset * 7);
  return date;
}

function weekDays(offset = 0) {
  const start = startOfWeek(offset);
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    return date;
  });
}

function recentCompletedTrend(tasks) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(today);
  start.setDate(today.getDate() - 6);
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    const count = tasks.filter((task) => {
      if (!task.completedAt) return false;
      const completed = new Date(task.completedAt);
      if (Number.isNaN(completed.getTime())) return false;
      return sameCalendarDay(completed, date);
    }).length;
    return { date, label: `${date.getMonth() + 1}/${date.getDate()}`, count };
  });
}

function scheduledCountsForWeek(tasks, offset = 0) {
  return weekDays(offset).map((date) => {
    const count = tasks.filter((task) => {
      if (!task.scheduledDate) return false;
      const scheduled = new Date(task.scheduledDate);
      if (Number.isNaN(scheduled.getTime())) return false;
      return sameCalendarDay(scheduled, date);
    }).length;
    return { date, label: `${date.getMonth() + 1}/${date.getDate()}`, count };
  });
}

function localDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function normalizeActivityDays(value) {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.filter((item) => typeof item === "string" && /^\d{4}-\d{2}-\d{2}$/.test(item)))].sort();
}

function streakFromActivityDays(days) {
  const set = new Set(normalizeActivityDays(days));
  let streak = 0;
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  while (set.has(localDateKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
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

function normalizeVisibleText(value) {
  const replacements = [
    ["副本", "项目"],
    ["任务节点", "任务"],
    ["Quest Log", "任务清单"],
    ["坐牢中", "卡住"],
    ["坐牢", "卡住"],
    ["出狱", "恢复推进"],
    ["卡关牢房", "卡关处理"],
    ["卡关原因", "卡住原因"],
    ["出狱办法", "解决办法"],
    ["已封印", "已暂停"],
    ["封印中", "已暂停"],
    ["封印", "暂停"],
    ["解封", "恢复"],
    ["Dungeons", "Projects"],
    ["Dungeon", "Project"],
    ["dungeons", "projects"],
    ["dungeon", "project"],
    ["sealed", "paused"],
    ["Sealed", "Paused"],
  ];
  return replacements.reduce((text, [search, replacement]) => text.split(search).join(replacement), String(value || ""));
}

function normalizeProjectIcon(icon, index = 0) {
  const iconMap = {
    "🏰": "📁",
    "🧙‍♀️": "📘",
    "🌲": "🗂️",
    "🗺️": "📁",
  };
  const fallbackIcons = ["📁", "🧩", "🗂️", "📝"];
  return iconMap[icon] || icon || fallbackIcons[index % fallbackIcons.length];
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
      icon: normalizeProjectIcon(project.icon, index),
      title: project.title || "Untitled",
      subtitle: project.subtitle || "",
      note: project.note || "",
      status: normalizeVisibleText(project.status || ""),
      level: Number(project.level || 1),
      category: project.category || "个人项目",
      tint: project.tint || "blue",
      paused: Boolean(project.paused),
      archived: Boolean(project.archived),
      archivedAt: project.archivedAt || null,
      stuck: Boolean(project.stuck),
      stuckReason: project.stuckReason || "",
      stuckPlan: project.stuckPlan || "",
      blockerLog: Array.isArray(project.blockerLog) ? project.blockerLog.map((item, logIndex) => ({
        id: item.id || `blocker-${logIndex}`,
        reason: String(item.reason || ""),
        plan: String(item.plan || ""),
        resolvedAt: item.resolvedAt || item.createdAt || new Date().toISOString(),
      })) : [],
      deletedAt: project.deletedAt || null,
      tasks: Array.isArray(project.tasks)
        ? project.tasks
            .map((task, taskIndex) => ({
              id: task.id || `task-${taskIndex}`,
              title: task.title || "Untitled task",
              weight: Number(task.weight || 10),
              done: Boolean(task.done),
              type: task.type || "普通任务",
              action: task.action || "",
              deletedAt: task.deletedAt || null,
              focusMode: Boolean(task.focusMode),
              focusAction: String(task.focusAction || "").replace("。只做开头，不求完成。", "").replace(". Just begin, no need to finish.", ""),
              ...(task.createdAt ? { createdAt: task.createdAt } : {}),
              completedAt: task.completedAt || null,
              scheduledDate: task.scheduledDate || task.dueDate || null,
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
  const icons = ["📁", "🧩", "🗂️", "📝"];
  const tints = ["blue", "purple", "green"];
  return {
    id,
    icon: icons[index % icons.length],
    title,
    subtitle: lang === "zh" ? "新的项目，先添加第一个任务" : "A new project. Add the first task.",
    note: "",
    status: lang === "zh" ? "刚刚创建" : "Just created",
    level: Number(level) || 1,
    category,
    tint: tints[index % tints.length],
    paused: false,
    archived: false,
    archivedAt: null,
    stuck: false,
    stuckReason: "",
    stuckPlan: "",
    blockerLog: [],
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
  console.assert(labelFor("en", "taskType", "史莱姆") === "Low-pressure task", "labelFor should translate legacy task types.");
  console.assert(labelFor("zh", "taskType", "主线") === "核心任务", "labelFor should normalize legacy Chinese task types.");
}

if (typeof console !== "undefined") runSelfTests();

function Card({ children, className = "", ...props }) {
  return <section {...props} className={cx("max-w-full rounded-[14px] border border-black/[0.05] bg-white shadow-[0_24px_70px_rgba(0,0,0,0.055)]", className)}>{children}</section>;
}

function Button({ children, variant = "dark", className = "", ...props }) {
  const styles = {
    dark: "bg-[#1D1D1F] text-white hover:bg-black focus:ring-black/10 disabled:cursor-not-allowed disabled:opacity-50",
    light: "bg-[#F5F5F7] text-[#1D1D1F] hover:bg-[#ECECEF] focus:ring-black/10 disabled:cursor-not-allowed disabled:opacity-50",
    green: "bg-[#EAF8EE] text-[#1C7C38] hover:bg-[#DFF3E5] focus:ring-[#34C759]/20 disabled:cursor-not-allowed disabled:opacity-50",
  };
  return <button {...props} className={cx("inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-4 py-2 text-[14px] font-medium transition active:scale-[0.98] focus:outline-none focus:ring-4", styles[variant], className)}>{children}</button>;
}

function PixelBadge({ children, tone = "neutral", ...props }) {
  const styles = {
    neutral: "bg-[#F5F5F7] text-[#6E6E73] ring-black/[0.04]",
    blue: "bg-[#F0F7FF] text-[#007AFF] ring-[#007AFF]/10",
    gold: "bg-[#FFF6D6] text-[#8A6400] ring-[#FFD60A]/25",
    red: "bg-[#FFF1EF] text-[#D93025] ring-[#FF453A]/10",
    green: "bg-[#F0FAF3] text-[#248A3D] ring-[#34C759]/15",
  };
  return <span {...props} className={cx("inline-flex items-center gap-1 rounded-[9px] px-2 py-1 text-[11px] font-medium leading-none ring-1", styles[tone])}>{children}</span>;
}

function PixelIcon({ children, className = "" }) {
  return <div className={cx("grid h-14 w-14 shrink-0 place-items-center rounded-[14px] text-[28px] ring-1 ring-black/[0.04]", className)}><span>{typeof children === "string" ? <Folder className="h-6 w-6 text-[#6E6E73]" /> : children}</span></div>;
}

function EmptyState({ children }) {
  return <div className="rounded-[16px] bg-[#F5F5F7] p-5 text-center text-[14px] leading-6 text-[#86868B] sm:p-8">{children}</div>;
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
    { id: "home", label: c.home, icon: Home, width: "w-[72px]" },
    { id: "dashboard", label: c.dashboard, icon: Layers, width: "w-[92px]" },
    { id: "now", label: c.now, icon: CheckSquare, width: "w-[108px]" },
    { id: "ideas", label: c.ideas, icon: StickyNote, width: "w-[112px]" },
    { id: "trash", label: c.trash, icon: Archive, count: trashCount, width: "w-[88px]" },
  ];
  return (
    <nav className="sticky top-0 z-20 border-b border-black/[0.05] bg-[#F5F5F7]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl flex-col gap-1.5 px-4 py-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-8">
        <button type="button" onClick={() => setActivePage("home")} className="flex min-h-9 w-fit items-center gap-2 rounded-full pr-2 text-[14px] font-medium text-[#1D1D1F] focus:outline-none focus:ring-4 focus:ring-black/10">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-white shadow-sm ring-1 ring-black/[0.04]"><Layers className="h-4 w-4 text-[#007AFF]" /></span>
          {c.brand}
        </button>
        <div className="-mx-1 flex items-center gap-2 overflow-x-auto px-1 pb-1 sm:mx-0 sm:pb-0">
          <button type="button" onClick={() => setLang(lang === "zh" ? "en" : "zh")} className="min-h-9 w-14 shrink-0 rounded-full bg-white px-3 text-[12px] font-medium text-[#6E6E73] shadow-sm ring-1 ring-black/[0.05] transition hover:bg-[#F5F5F7] hover:text-[#1D1D1F] focus:outline-none focus:ring-4 focus:ring-black/10">{c.languageButton}</button>
          <div className="flex min-w-max items-center gap-1 rounded-full bg-white p-1 shadow-sm ring-1 ring-black/[0.05]">
            {items.map((item) => {
              const Icon = item.icon;
              const active = activePage === item.id;
              return (
                <button key={item.id} type="button" onClick={() => setActivePage(item.id)} className={cx("inline-flex min-h-9 shrink-0 items-center justify-center gap-1.5 rounded-full px-2.5 text-[12px] font-medium transition focus:outline-none focus:ring-4 focus:ring-black/10", item.width, active ? "bg-[#1D1D1F] text-white" : "text-[#6E6E73] hover:bg-[#F5F5F7] hover:text-[#1D1D1F]")}>
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

function HomeEntryCard({ icon: Icon, title, description, stat, tone = "blue", onClick }) {
  const tones = {
    blue: "bg-[#F0F7FF] text-[#007AFF] ring-[#007AFF]/10",
    purple: "bg-[#F4F1FF] text-[#7C5CFF] ring-[#7C5CFF]/10",
    green: "bg-[#F0FAF3] text-[#248A3D] ring-[#34C759]/12",
    gray: "bg-[#F5F5F7] text-[#6E6E73] ring-black/[0.05]",
  };
  return (
    <button type="button" onClick={onClick} className="group flex h-full min-h-[168px] flex-col rounded-[20px] border border-black/[0.05] bg-white/85 p-5 text-left shadow-[0_18px_46px_rgba(15,23,42,0.045)] backdrop-blur transition hover:-translate-y-0.5 hover:shadow-[0_24px_60px_rgba(15,23,42,0.065)] focus:outline-none focus:ring-4 focus:ring-black/10">
      <div className="mb-5 flex items-start justify-between gap-4">
        <span className={cx("grid h-11 w-11 place-items-center rounded-2xl ring-1", tones[tone])}><Icon className="h-5 w-5" /></span>
        <span className="rounded-full bg-[#F5F5F7] px-3 py-1 text-[12px] font-medium text-[#6E6E73]">{stat}</span>
      </div>
      <div className="text-[18px] font-medium tracking-[-0.01em] text-[#1D1D1F]">{title}</div>
      <p className="mt-3 flex-1 text-[14px] leading-6 text-[#6E6E73]">{description}</p>
      <div className="mt-5 flex justify-end text-[#007AFF]"><ArrowRight className="h-5 w-5 transition group-hover:translate-x-0.5" /></div>
    </button>
  );
}

export default function ADHDQuestBoardPrototype() {
  const [activePage, setActivePage] = useState("home");
  const [lang, setLang] = useState("zh");
  const [projects, setProjects] = useState(() => loadFromStorage(PROJECTS_KEY, initialProjects, normalizeProjects));
  const [selectedId, setSelectedId] = useState("store");
  const [ideas, setIdeas] = useState(() => loadFromStorage(IDEAS_KEY, initialIdeas, normalizeIdeas));
  const [activityDays, setActivityDays] = useState(() => loadFromStorage(ACTIVITY_DAYS_KEY, [], normalizeActivityDays));
  const [thought, setThought] = useState("");
  const [newIdeaCategory, setNewIdeaCategory] = useState("灵感");
  const [ideaCategoryFilter, setIdeaCategoryFilter] = useState("全部");
  const [ideaSearch, setIdeaSearch] = useState("");
  const [nextFilter, setNextFilter] = useState("active");
  const [newTask, setNewTask] = useState("");
  const [newTaskAction, setNewTaskAction] = useState("");
  const [newWeight, setNewWeight] = useState(10);
  const [newTaskType, setNewTaskType] = useState("普通任务");
  const [newTaskSchedule, setNewTaskSchedule] = useState("");
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
  const [editingTaskMeta, setEditingTaskMeta] = useState(null);
  const [draftTitle, setDraftTitle] = useState("");
  const [todayStepIndex, setTodayStepIndex] = useState(0);
  const [weekOffset, setWeekOffset] = useState(0);

  const c = copyMap[lang];
  const activeProjects = useMemo(() => projects.filter((project) => !project.deletedAt), [projects]);
  const visibleProjects = useMemo(() => [...activeProjects].sort((a, b) => {
    const priority = (project) => (project.stuck ? 0 : project.archived ? 3 : project.paused ? 2 : 1);
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

  const allNextSteps = useMemo(() => visibleProjects.filter((project) => !project.archived).map((project) => ({ project, task: nextTask(project), progress: progressOf(project) })).filter((item) => item.task), [visibleProjects]);
  const filteredNextSteps = useMemo(() => {
    if (nextFilter === "boss") return allNextSteps.filter((item) => isMilestoneTask(item.task.type));
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
  const activityStreak = useMemo(() => streakFromActivityDays(activityDays), [activityDays]);
  const selectedTasks = useMemo(() => (selected ? activeTasksOf(selected) : []), [selected]);
  const selectedTaskStats = useMemo(() => {
    const completed = selectedTasks.filter((task) => task.done).length;
    const inProgress = selectedTasks.filter((task) => !task.done && task.focusMode).length;
    const notStarted = selectedTasks.filter((task) => !task.done && !task.focusMode).length;
    return {
      total: selectedTasks.length,
      completed,
      inProgress,
      notStarted,
      completionRate: selectedTasks.length ? Math.round((completed / selectedTasks.length) * 100) : 0,
    };
  }, [selectedTasks]);
  const selectedCompletedTrend = useMemo(() => recentCompletedTrend(selectedTasks), [selectedTasks]);
  const selectedWeekDays = useMemo(() => scheduledCountsForWeek(selectedTasks, weekOffset), [selectedTasks, weekOffset]);

  useEffect(() => saveToStorage(PROJECTS_KEY, projects), [projects]);
  useEffect(() => saveToStorage(IDEAS_KEY, ideas), [ideas]);
  useEffect(() => saveToStorage(ACTIVITY_DAYS_KEY, activityDays), [activityDays]);
  useEffect(() => {
    if (selectedId && activeProjects.some((project) => project.id === selectedId)) return;
    setSelectedId(activeProjects[0]?.id || "");
  }, [activeProjects, selectedId]);

  useEffect(() => {
    if (todayStepIndex < filteredNextSteps.length || filteredNextSteps.length === 0) return;
    setTodayStepIndex(0);
  }, [filteredNextSteps.length, todayStepIndex]);

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

  function markActivityToday() {
    const today = localDateKey();
    setActivityDays((days) => normalizeActivityDays([...days, today]));
  }

  function completeTask(projectId, taskId) {
    const targetProject = activeProjects.find((project) => project.id === projectId);
    const targetTask = targetProject?.tasks?.find((task) => task.id === taskId);
    if (targetProject && !targetProject.paused && targetTask && !targetTask.done) markActivityToday();
    const completedAt = new Date().toISOString();
    setProjects((prev) => prev.map((project) => {
      if (project.id !== projectId || project.paused) return project;
      return {
        ...project,
        status: lang === "zh" ? "刚刚推进" : "Just advanced",
        tasks: project.tasks.map((task) => (
          task.id === taskId
            ? { ...task, done: !task.done, completedAt: task.done ? null : completedAt }
            : task
        )),
      };
    }));
  }

  function updateTaskAction(projectId, taskId, action) {
    setProjects((prev) => prev.map((project) => (project.id !== projectId ? project : { ...project, tasks: project.tasks.map((task) => (task.id === taskId ? { ...task, action } : task)) })));
  }

  function updateTaskMeta(projectId, taskId, field, value) {
    setProjects((prev) => prev.map((project) => (project.id !== projectId ? project : {
      ...project,
      tasks: project.tasks.map((task) => {
        if (task.id !== taskId) return task;
        return { ...task, [field]: field === "weight" ? Number(value) || 1 : value };
      }),
    })));
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
    const targetProject = activeProjects.find((project) => project.id === projectId);
    const targetTask = targetProject?.tasks?.find((task) => task.id === taskId);
    if (targetProject && !targetProject.paused && targetTask && !targetTask.focusMode) markActivityToday();
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
        tasks: [...project.tasks, { id: makeId("task"), title: value, weight, done: false, type: newTaskType, action: newTaskAction.trim() || (lang === "zh" ? "先把它缩成 5 分钟能开始的一步。" : "Shrink it into a step you can start in 5 minutes."), deletedAt: null, focusMode: false, focusAction: "", completedAt: null, scheduledDate: newTaskSchedule || null }],
      };
    }));
    setNewTask("");
    setNewTaskAction("");
    setNewWeight(10);
    setNewTaskType("普通任务");
    setNewTaskSchedule("");
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
        return { id: makeId("task"), title: title || (lang === "zh" ? "未命名任务" : "Untitled task"), weight: Number.isFinite(parsedWeight) && parsedWeight > 0 ? parsedWeight : Number(newWeight), done: false, type, action, deletedAt: null, focusMode: false, focusAction: "", completedAt: null, scheduledDate: newTaskSchedule || null };
      });
      return { ...project, tasks: [...project.tasks, ...created] };
    }));
    setBatchText("");
    setNewTaskSchedule("");
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
    setProjects((prev) => prev.map((project) => (project.id !== projectId ? project : { ...project, status: lang === "zh" ? "任务已进回收站" : "Task moved to trash", tasks: project.tasks.map((task) => (task.id === taskId ? { ...task, deletedAt: now } : task)) })));
  }

  function restoreTask(projectId, taskId) {
    setProjects((prev) => prev.map((project) => (project.id !== projectId ? project : { ...project, status: lang === "zh" ? "任务已恢复" : "Task restored", tasks: project.tasks.map((task) => (task.id === taskId ? { ...task, deletedAt: null } : task)) })));
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

  function toggleArchiveProject(projectId) {
    const target = activeProjects.find((project) => project.id === projectId);
    if (!target) return;
    const nextArchived = !target.archived;
    setProjects((prev) => prev.map((project) => {
      if (project.id !== projectId) return project;
      return {
        ...project,
        archived: nextArchived,
        archivedAt: nextArchived ? new Date().toISOString() : null,
        paused: nextArchived ? true : false,
        stuck: nextArchived ? false : project.stuck,
        status: nextArchived ? (lang === "zh" ? "已归档" : "Archived") : (lang === "zh" ? "恢复推进" : "Resumed"),
      };
    }));
  }

  function restoreProject(projectId) {
    setProjects((prev) => prev.map((project) => (project.id === projectId ? { ...project, deletedAt: null, paused: false, archived: false, archivedAt: null, status: lang === "zh" ? "已恢复" : "Restored" } : project)));
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

  function toggleProjectStuck(projectId) {
    const target = activeProjects.find((project) => project.id === projectId);
    if (!target || target.paused) return;
    const nextStuck = !target.stuck;
    const resolvedAt = new Date().toISOString();
    setProjects((prev) => prev.map((project) => {
      if (project.id !== projectId) return project;
      const blockerLog = nextStuck ? (project.blockerLog || []) : [{
        id: makeId("blocker"),
        reason: project.stuckReason || "",
        plan: project.stuckPlan || "",
        resolvedAt,
      }, ...(project.blockerLog || [])];
      return {
        ...project,
        stuck: nextStuck,
        status: nextStuck ? (lang === "zh" ? "卡住" : "Blocked") : (lang === "zh" ? "恢复推进" : "Resumed"),
        stuckReason: nextStuck ? project.stuckReason || "" : "",
        stuckPlan: nextStuck ? project.stuckPlan || "" : "",
        blockerLog,
      };
    }));
  }

  function deleteBlockerLog(projectId, logId) {
    setProjects((prev) => prev.map((project) => (
      project.id === projectId
        ? { ...project, blockerLog: (project.blockerLog || []).filter((item) => item.id !== logId) }
        : project
    )));
  }

  function toggleJailSelected() {
    if (!selected) return;
    toggleProjectStuck(selected.id);
  }

  function toggleProjectPaused(projectId) {
    const target = activeProjects.find((project) => project.id === projectId);
    if (!target) return;
    setProjects((prev) => prev.map((project) => {
      if (project.id !== projectId) return project;
      const nextPaused = !project.paused;
      return { ...project, paused: nextPaused, stuck: nextPaused ? false : project.stuck, status: nextPaused ? (lang === "zh" ? "已暂停" : "Paused") : (lang === "zh" ? "恢复" : "Resumed") };
    }));
  }

  function toggleSealSelected() {
    if (!selected) return;
    toggleProjectPaused(selected.id);
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
    <div className="min-h-screen overflow-x-hidden bg-[#F5F5F7] text-[#1D1D1F] antialiased" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Arial, sans-serif' }}>
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
              <button type="button" onClick={() => deleteIdea(idea.id)} className="grid h-11 w-11 place-items-center rounded-full text-[#A1A1A6] transition hover:bg-white hover:text-[#D93025] focus:outline-none focus:ring-4 focus:ring-black/10" aria-label="delete idea"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
      </div>
    );
  }

  function renderProjectSwitcher() {
    return (
      <Card className="p-4 sm:p-5">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-[20px] font-medium tracking-[-0.02em]">{c.project}</h3>
              <button type="button" onClick={() => setProjectManagerOpen(true)} className="rounded-full bg-[#F5F5F7] px-3 py-1.5 text-[12px] font-medium text-[#6E6E73] transition hover:bg-[#ECECEF] hover:text-[#1D1D1F] focus:outline-none focus:ring-4 focus:ring-black/10">{c.manageProjects}</button>
            </div>
            <p className="mt-1 text-[12px] font-normal leading-5 text-[#9A9AA0]">{c.projectHint}</p>
          </div>
          <BookOpen className="h-5 w-5 shrink-0 text-[#C7C7CC]" />
        </div>
        <div className="mb-3 space-y-2">
          <div className="flex gap-2">
            <input value={newProjectTitle} onChange={(event) => setNewProjectTitle(event.target.value)} onKeyDown={(event) => event.key === "Enter" && addProject()} placeholder={c.addProjectPlaceholder} className="min-h-11 min-w-0 flex-1 rounded-full border-0 bg-[#F5F5F7] px-4 text-[14px] outline-none transition placeholder:text-[#A1A1A6] focus:bg-white focus:ring-4 focus:ring-black/10" />
            <Button onClick={addProject} className="h-11 w-11 shrink-0 px-0" aria-label="add project"><Plus className="h-4 w-4" /></Button>
          </div>
          <div className="grid grid-cols-[1fr_96px] gap-2">
            <select value={newProjectCategory} onChange={(event) => setNewProjectCategory(event.target.value)} className="min-h-11 rounded-full border-0 bg-[#F5F5F7] px-4 text-[13px] font-medium text-[#6E6E73] outline-none focus:bg-white focus:ring-4 focus:ring-black/10" title={c.projectType}>{PROJECT_CATEGORIES.map((category) => <option key={category} value={category}>{labelFor(lang, "projectCategory", category)}</option>)}</select>
            <label className="flex min-h-11 items-center gap-1.5 rounded-full bg-[#F5F5F7] px-3 text-[13px] font-medium text-[#6E6E73] focus-within:bg-white focus-within:ring-4 focus-within:ring-black/10" title={c.projectLevel}>
              <span>{c.projectLevel}</span>
              <input type="number" min="1" max="99" value={newProjectLevel} onChange={(event) => setNewProjectLevel(Number(event.target.value) || 1)} className="min-w-0 flex-1 border-0 bg-transparent p-0 text-[13px] font-medium outline-none" />
            </label>
          </div>
        </div>
        {visibleProjects.length ? (
          <div className="max-h-[430px] space-y-2 overflow-y-auto pr-1">
            {visibleProjects.map((project) => {
              const p = progressOf(project);
              const active = project.id === selected?.id;
              const pt = tintMap[project.tint] || tintMap.blue;
              return (
                <div key={project.id} draggable onDragStart={() => setDraggingProjectId(project.id)} onDragOver={(event) => event.preventDefault()} onDrop={() => { reorderProjectById(draggingProjectId, project.id); setDraggingProjectId(null); }} className={cx("flex items-center gap-2 rounded-[14px] p-2 transition", active ? `bg-white shadow-sm ring-2 ${pt.ring}` : "bg-[#F5F5F7] hover:bg-white")}>
                  <div className="grid h-8 w-5 shrink-0 cursor-grab place-items-center rounded-full text-[14px] text-[#C7C7CC] active:cursor-grabbing">⋮⋮</div>
                  <button type="button" onClick={() => setSelectedId(project.id)} className="min-w-0 flex flex-1 items-center gap-3 rounded-[12px] p-1.5 text-left focus:outline-none focus:ring-4 focus:ring-black/10">
                    <PixelIcon className={cx("h-11 w-11 rounded-xl text-xl", pt.bg)}>{project.icon}</PixelIcon>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2"><div className="truncate text-[15px] font-medium">{project.title}</div>{project.stuck && <PixelBadge tone="red"><CircleAlert className="h-3 w-3" /> {c.rescue}</PixelBadge>}{project.archived && <PixelBadge tone="green"><Archive className="h-3 w-3" /> {c.statusArchived}</PixelBadge>}{project.paused && !project.archived && <PixelBadge tone="neutral"><PauseCircle className="h-3 w-3" /> {c.statusSealed}</PixelBadge>}</div>
                      <div className="mt-1 flex items-center gap-2 text-[12px] text-[#9A9AA0]"><span className="truncate">{labelFor(lang, "projectCategory", project.category || "个人项目")}</span><span>{c.projectLevel} {project.level}</span><span className="w-8 shrink-0 tabular-nums">{p}%</span><div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#E5E5EA]"><div className={cx("h-full rounded-full", pt.bar)} style={{ width: `${p}%` }} /></div></div>
                      <div className="mt-0.5 truncate text-[12px] text-[#9A9AA0]">{project.note || project.status}</div>
                    </div>
                  </button>
                  <button type="button" onClick={() => moveProjectToTrash(project.id)} className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-[#A1A1A6] transition hover:bg-[#F5F5F7] hover:text-[#D93025] focus:outline-none focus:ring-4 focus:ring-black/10"><Trash2 className="h-4 w-4" /></button>
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
      <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/20 px-3 py-4 backdrop-blur-sm sm:items-center sm:px-5 sm:py-8">
        <button className="absolute inset-0 cursor-default" aria-label="close project manager" onClick={() => setProjectManagerOpen(false)} />
        <Card className="relative max-h-[86vh] w-full max-w-3xl overflow-auto p-6 sm:p-7">
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div><h3 className="text-[24px] font-semibold tracking-[-0.03em]">{c.manageProjects}</h3><p className="mt-1 text-[13px] leading-5 text-[#86868B]">{c.manageProjectsDesc}</p></div>
            <div className="flex gap-2"><select value={projectCategoryFilter} onChange={(event) => setProjectCategoryFilter(event.target.value)} className="min-h-11 rounded-full border-0 bg-[#F5F5F7] px-4 text-[13px] font-medium text-[#6E6E73] outline-none focus:bg-white focus:ring-4 focus:ring-black/10">{["全部", ...PROJECT_CATEGORIES].map((category) => <option key={category} value={category}>{category === "全部" ? c.allProjectTypes : labelFor(lang, "projectCategory", category)}</option>)}</select><button type="button" onClick={() => setProjectManagerOpen(false)} className="grid h-11 w-11 place-items-center rounded-full bg-[#F5F5F7] text-[18px] text-[#86868B] transition hover:bg-[#ECECEF] hover:text-[#1D1D1F] focus:outline-none focus:ring-4 focus:ring-black/10">x</button></div>
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
                    <label className="flex min-h-11 items-center gap-1.5 rounded-[14px] bg-white px-3 text-[13px] font-medium text-[#6E6E73] focus-within:ring-4 focus-within:ring-black/10"><span>{c.projectLevel}</span><input type="number" min="1" max="99" value={project.level} onChange={(event) => updateProjectField(project.id, "level", event.target.value)} className="min-w-0 flex-1 border-0 bg-transparent p-0 outline-none" /></label>
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

  function renderBlockerHistory() {
    const logs = selected?.blockerLog || [];
    if (!logs.length) return null;
    return (
      <Card className="p-5 sm:p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#F5F5F7] text-[#6E6E73]"><RefreshCw className="h-5 w-5" /></span>
            <h3 className="text-[18px] font-medium tracking-[-0.015em] text-[#1D1D1F]">{c.blockerHistory}</h3>
          </div>
          <PixelBadge tone="neutral">{logs.length}</PixelBadge>
        </div>
        <div className="space-y-3">
          {logs.slice(0, 3).map((item) => (
            <div key={item.id} className="rounded-[16px] bg-[#F5F5F7] p-4">
              <div className="mb-2 flex items-center justify-between gap-3">
                <div className="text-[12px] font-medium text-[#86868B]">{c.blockerResolvedAt} {formatTime(item.resolvedAt)}</div>
                <button type="button" onClick={() => selected && deleteBlockerLog(selected.id, item.id)} className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-[#A1A1A6] transition hover:bg-white hover:text-[#D93025] focus:outline-none focus:ring-4 focus:ring-black/10" aria-label={c.deleteRecord} title={c.deleteRecord}><Trash2 className="h-4 w-4" /></button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div><div className="mb-1 text-[12px] font-medium text-[#D93025]">{c.jailReasonTitle}</div><p className="break-words text-[13px] leading-5 text-[#6E6E73]">{item.reason || c.jailReasonPlaceholder}</p></div>
                <div><div className="mb-1 text-[12px] font-medium text-[#1D1D1F]">{c.jailPlanTitle}</div><p className="break-words text-[13px] leading-5 text-[#6E6E73]">{item.plan || c.jailPlanPlaceholder}</p></div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  function renderAddTaskModal() {
    if (!taskModalOpen) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/20 px-3 py-4 backdrop-blur-sm sm:items-center sm:px-5 sm:py-8">
        <button className="absolute inset-0 cursor-default" aria-label="close modal" onClick={() => setTaskModalOpen(false)} />
        <Card className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto p-4 sm:p-7">
          <div className="mb-5 flex items-start justify-between gap-4"><div><h3 className="text-[24px] font-semibold tracking-[-0.03em]">{c.addNode}</h3><p className="mt-1 text-[13px] leading-5 text-[#86868B]">{c.addNodeDesc}</p></div><button type="button" onClick={() => setTaskModalOpen(false)} className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#F5F5F7] text-[20px] text-[#86868B] transition hover:bg-[#ECECEF] hover:text-[#1D1D1F] focus:outline-none focus:ring-4 focus:ring-black/10" aria-label="close add task modal">x</button></div>
          <div className="space-y-3"><input value={newTask} onChange={(event) => setNewTask(event.target.value)} placeholder={selected ? c.nodeNamePlaceholder : c.noProject} disabled={!selected} className="min-h-11 w-full rounded-[14px] border-0 bg-[#F5F5F7] px-4 text-[15px] outline-none transition placeholder:text-[#A1A1A6] focus:bg-white focus:ring-4 focus:ring-black/10 disabled:opacity-50" /><textarea value={newTaskAction} onChange={(event) => setNewTaskAction(event.target.value)} placeholder={c.nodeDescPlaceholder} disabled={!selected} rows={3} className="w-full resize-none rounded-[14px] border-0 bg-[#F5F5F7] px-4 py-3 text-[15px] leading-6 outline-none transition placeholder:text-[#A1A1A6] focus:bg-white focus:ring-4 focus:ring-black/10 disabled:opacity-50" /><div className="grid gap-3 sm:grid-cols-3"><label className="space-y-1"><span className="text-[12px] font-medium text-[#86868B]">{c.taskWeight}</span><select value={newWeight} onChange={(event) => setNewWeight(Number(event.target.value) || 10)} disabled={!selected} className="min-h-11 w-full rounded-[14px] border-0 bg-[#F5F5F7] px-4 text-[15px] font-medium outline-none focus:bg-white focus:ring-4 focus:ring-black/10 disabled:opacity-50">{TASK_WEIGHTS.map((weight) => <option key={weight} value={weight}>{weight}%</option>)}</select></label><label className="space-y-1"><span className="text-[12px] font-medium text-[#86868B]">{c.taskType}</span><select value={newTaskType} onChange={(event) => setNewTaskType(event.target.value)} disabled={!selected} className="min-h-11 w-full rounded-[14px] border-0 bg-[#F5F5F7] px-4 text-[15px] font-medium outline-none focus:bg-white focus:ring-4 focus:ring-black/10 disabled:opacity-50">{TASK_TYPES.map((type) => <option key={type} value={type}>{labelFor(lang, "taskType", type)}</option>)}</select></label><label className="space-y-1"><span className="text-[12px] font-medium text-[#86868B]">{c.scheduleDate}</span><input type="date" value={newTaskSchedule} onChange={(event) => setNewTaskSchedule(event.target.value)} disabled={!selected} className="min-h-11 w-full rounded-[14px] border-0 bg-[#F5F5F7] px-4 text-[14px] font-medium text-[#6E6E73] outline-none focus:bg-white focus:ring-4 focus:ring-black/10 disabled:opacity-50" /></label></div><Button onClick={addTask} className={!selected ? "opacity-50" : ""}><Plus className="h-4 w-4" /> {c.add}</Button><div className="rounded-[16px] bg-[#F5F5F7] p-4"><div className="mb-2 text-[14px] font-medium text-[#1D1D1F]">{c.batchAdd}</div><p className="mb-3 text-[12px] leading-5 text-[#86868B]">{c.batchTip}</p><textarea value={batchText} onChange={(event) => setBatchText(event.target.value)} placeholder={c.batchPlaceholder} rows={5} className="w-full resize-none rounded-[14px] border-0 bg-white px-4 py-3 text-[14px] leading-6 outline-none transition placeholder:text-[#A1A1A6] focus:ring-4 focus:ring-black/10" /><Button onClick={addBatchTasks} variant="light" className="mt-3"><Plus className="h-4 w-4" /> {c.batchAdd}</Button></div></div>
        </Card>
      </div>
    );
  }

  function renderProjectOverviewCard() {
    return (
      <Card className="p-5">
        {selected ? (
          <>
            <div className="grid gap-4 sm:grid-cols-[auto_minmax(0,1fr)] lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-start">
              <PixelIcon className={tint.bg}>{selected.icon}</PixelIcon>
              <div className="min-w-0">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <PixelBadge tone="blue" title={c.dungeonHint}>{c.projectLabel}</PixelBadge>
                  <PixelBadge tone="gold" title={c.levelHint}>{c.projectLevel} {selected.level}</PixelBadge>
                  {selected.archived && <PixelBadge tone="green" title={c.archiveHint}>{c.statusArchived}</PixelBadge>}
                  {selected.paused && !selected.archived && <PixelBadge tone="neutral" title={c.sealedBadgeHint}>{c.statusSealed}</PixelBadge>}
                  {selected.stuck && <PixelBadge tone="red"><CircleAlert className="h-3 w-3" /> {c.rescue}</PixelBadge>}
                </div>
                {editingProjectId === selected.id ? (
                  <input
                    value={draftTitle}
                    onChange={(event) => setDraftTitle(event.target.value)}
                    onBlur={commitRename}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") commitRename();
                      if (event.key === "Escape") {
                        setEditingProjectId(null);
                        setDraftTitle("");
                      }
                    }}
                    autoFocus
                    className="w-full max-w-sm rounded-xl bg-[#F5F5F7] px-3 py-2 text-[22px] font-medium leading-tight tracking-[-0.028em] outline-none ring-1 ring-black/[0.06] focus:bg-white focus:ring-4 focus:ring-black/10"
                  />
                ) : (
                  <div className="flex min-w-0 items-center gap-2">
                    <h2 className="min-w-0 break-words text-[22px] font-medium leading-tight tracking-[-0.028em]">{selected.title}</h2>
                    <button type="button" onClick={() => startRename(selected)} className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-[#A1A1A6] transition hover:bg-[#F5F5F7] hover:text-[#1D1D1F] focus:outline-none focus:ring-4 focus:ring-black/10" aria-label="rename project"><Pencil className="h-4 w-4" /></button>
                  </div>
                )}
                <input value={selected.subtitle || ""} onChange={(event) => updateProjectField(selected.id, "subtitle", event.target.value)} className="mt-2 block min-h-10 w-full rounded-[12px] border-0 bg-[#F5F5F7] px-3 text-[14px] font-normal text-[#86868B] outline-none transition focus:bg-white focus:ring-4 focus:ring-black/10" />
              </div>
              <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-row lg:grid lg:grid-cols-1">
                <Button onClick={toggleJailSelected} variant="light" disabled={selected.paused} className={cx("w-full sm:w-[128px] lg:w-full", selected.paused ? "opacity-50" : "")}><CircleAlert className="h-4 w-4" /> <span className="min-w-[56px] text-center">{selected.stuck ? c.closeJail : c.rescue}</span></Button>
                <Button onClick={toggleSealSelected} variant="light" title={c.sealHint} className="w-full sm:w-[112px] lg:w-full"><PauseCircle className="h-4 w-4" /> <span className="min-w-[42px] text-center">{selected.paused ? c.unseal : c.seal}</span></Button>
                {(progress === 100 || selected.archived) && <Button onClick={() => toggleArchiveProject(selected.id)} variant="light" title={c.archiveHint} className="col-span-2 w-full sm:col-span-1 sm:w-[112px] lg:w-full"><Archive className="h-4 w-4" /> {selected.archived ? c.unarchive : c.archive}</Button>}
              </div>
            </div>

            <div className="mt-3 rounded-[18px] bg-gradient-to-br from-[#F7F8FB] via-[#F5F5F7] to-[#EAF4FF] p-3 ring-1 ring-black/[0.04]">
              <div className="grid gap-4 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-end">
                <div className="shrink-0">
                  <div className="text-[12px] font-medium uppercase tracking-wide text-[#86868B]">Progress</div>
                  <div className="mt-1 text-[32px] font-medium tracking-[-0.05em] sm:text-[34px]">{progress}%</div>
                </div>
                <div className="rounded-[14px] bg-white/70 p-3 ring-1 ring-black/[0.04]">
                  <div className="mb-2 flex items-center justify-between text-[11px] font-medium uppercase tracking-wide text-[#A1A1A6]"><span>0</span><span>{progress}% {c.progressCleared}</span><span>100</span></div>
                  <div className="h-3 overflow-hidden rounded-full bg-[#E5E5EA]"><div className={cx("h-full rounded-full", tint.bar)} style={{ width: `${progress}%` }} /></div>
                </div>
              </div>
            </div>

            {selected.stuck && !selected.paused && (
              <div className="mt-6 rounded-[18px] bg-[#FFF1EF] p-4 ring-1 ring-[#FF453A]/10 sm:p-5">
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex min-w-0 gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-white text-[#D93025] ring-1 ring-[#FF453A]/10"><CircleAlert className="h-5 w-5" /></span>
                    <div className="min-w-0">
                      <div className="text-[18px] font-medium tracking-[-0.02em]">{c.rescueMode}</div>
                      <p className="mt-1 text-[13px] leading-5 text-[#6E6E73]">{c.rescueDesc}</p>
                    </div>
                  </div>
                  <Button onClick={toggleJailSelected} variant="light" className="shrink-0">{c.closeJail}</Button>
                </div>
                <div className="grid gap-4 lg:grid-cols-2">
                  <label className="block"><span className="mb-2 block text-[13px] font-medium text-[#1D1D1F]">{c.jailReasonTitle}</span><textarea value={selected.stuckReason || ""} onChange={(event) => updateProjectField(selected.id, "stuckReason", event.target.value)} placeholder={c.jailReasonPlaceholder} rows={4} className="w-full resize-none rounded-[16px] border-0 bg-white/70 px-4 py-3 text-[14px] leading-6 text-[#3A3A3C] outline-none transition focus:bg-white focus:ring-4 focus:ring-[#FF453A]/10" /></label>
                  <label className="block"><span className="mb-2 block text-[13px] font-medium text-[#1D1D1F]">{c.jailPlanTitle}</span><textarea value={selected.stuckPlan || ""} onChange={(event) => updateProjectField(selected.id, "stuckPlan", event.target.value)} placeholder={c.jailPlanPlaceholder} rows={4} className="w-full resize-none rounded-[16px] border-0 bg-white/70 px-4 py-3 text-[14px] leading-6 text-[#3A3A3C] outline-none transition focus:bg-white focus:ring-4 focus:ring-[#FF453A]/10" /></label>
                </div>
                <div className="mt-4 rounded-[16px] bg-white/60 px-4 py-3 text-[13px] leading-6 text-[#6E6E73]">{c.jailTip}</div>
              </div>
            )}

            {selected.paused && !selected.archived && (
              <div className="mt-6 rounded-[16px] bg-[#F5F5F7] p-5 ring-1 ring-black/[0.04]">
                <div className="text-[15px] font-medium text-[#1D1D1F]">{c.sealedPanelTitle}</div>
                <p className="mt-2 text-[14px] leading-6 text-[#86868B]">{c.sealedPanelDesc}</p>
              </div>
            )}
          </>
        ) : (
          <EmptyState><div className="text-3xl">🗂️</div><h2 className="mt-3 text-[20px] font-medium tracking-[-0.02em]">{c.noProject}</h2><p className="mt-2">{c.noProjectDesc}</p></EmptyState>
        )}
      </Card>
    );
  }

  function renderProjectInsightsCard() {
    const metrics = [
      { label: c.totalTasks, value: selectedTaskStats.total, badge: null, tone: "blue", icon: Target },
      { label: c.completedTasks, value: selectedTaskStats.completed, badge: `${selectedTaskStats.completionRate}%`, tone: "green", icon: Check },
      { label: c.inProgressTasks, value: selectedTaskStats.inProgress, badge: null, tone: "gold", icon: PlayCircle },
      { label: c.notStartedTasks, value: selectedTaskStats.notStarted, badge: null, tone: "neutral", icon: Circle },
    ];
    const maxTrend = Math.max(1, ...selectedCompletedTrend.map((item) => item.count));
    const totalScheduled = selectedWeekDays.reduce((sum, item) => sum + item.count, 0);
    const weekdayFormatter = new Intl.DateTimeFormat(lang === "zh" ? "zh-CN" : "en-US", { weekday: "short" });
    return (
      <Card className="p-4 sm:p-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h3 className="text-[20px] font-medium tracking-[-0.025em]">{c.insightsWeeklyPlan}</h3>
          {selected && <PixelBadge tone="neutral">{selected.title}</PixelBadge>}
        </div>

        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_270px]">
          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
            {metrics.map((metric) => {
              const Icon = metric.icon;
              return (
                <div key={metric.label} className="min-h-[64px] rounded-[14px] bg-[#F5F5F7] p-2.5 ring-1 ring-black/[0.03]">
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <span className="text-[11px] font-medium text-[#86868B]">{metric.label}</span>
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white text-[#6E6E73] ring-1 ring-black/[0.04]"><Icon className="h-3 w-3" /></span>
                  </div>
                  <div className="flex items-end justify-between gap-2">
                    <div className="text-[20px] font-medium tracking-[-0.04em] tabular-nums">{metric.value}</div>
                    {metric.badge && <PixelBadge tone={metric.tone}>{metric.badge}</PixelBadge>}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="rounded-[14px] bg-[#F5F5F7] p-2.5 ring-1 ring-black/[0.03]">
            <div className="mb-2 flex items-center justify-between gap-3">
              <h4 className="text-[12px] font-medium text-[#6E6E73]">{c.completedTrend}</h4>
              <span className="text-[11px] font-medium text-[#A1A1A6]">7</span>
            </div>
            <div className="grid grid-cols-[24px_minmax(0,1fr)] gap-2">
              <div className="flex h-[48px] flex-col justify-between text-[10px] text-[#A1A1A6]">
                <span>{maxTrend}</span>
                <span>0</span>
              </div>
              <div className="flex h-[48px] items-end justify-between gap-2">
                {selectedCompletedTrend.map((item) => (
                  <div key={item.label} className="flex min-w-0 flex-1 flex-col items-center gap-1">
                    <div className="flex h-8 w-full items-end justify-center">
                      <div className="w-2.5 rounded-t-full bg-[#007AFF]" style={{ height: item.count ? `${Math.max(8, (item.count / maxTrend) * 32)}px` : "3px" }} />
                    </div>
                    <span className="text-[10px] text-[#86868B]">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3 rounded-[14px] bg-[#F5F5F7] p-3 ring-1 ring-black/[0.03]">
          <div className="mb-2 flex items-center justify-between gap-3">
            <h4 className="text-[14px] font-medium tracking-[-0.01em]">{c.thisWeek}</h4>
            <PixelBadge tone="neutral">{totalScheduled}</PixelBadge>
          </div>
          <div className="grid grid-cols-[32px_minmax(0,1fr)_32px] items-stretch gap-2">
            <button type="button" onClick={() => setWeekOffset((value) => value - 1)} className="grid min-h-14 place-items-center rounded-[12px] bg-white/70 text-[#86868B] ring-1 ring-black/[0.04] transition hover:bg-white hover:text-[#1D1D1F] focus:outline-none focus:ring-4 focus:ring-black/10" aria-label={c.prevWeek} title={c.prevWeek}><ChevronRight className="h-4 w-4 rotate-180" /></button>
            <div className="min-w-0 overflow-x-auto lg:overflow-visible">
              <div className="grid min-w-[620px] grid-cols-7 gap-2 lg:min-w-0">
                {selectedWeekDays.map((item) => {
                  const isToday = sameCalendarDay(item.date, new Date());
                  return (
                    <div key={item.label} className={cx("rounded-[12px] bg-white/70 px-2 py-1.5 text-center ring-1", isToday ? "bg-white ring-[#007AFF]/25" : "ring-black/[0.04]")}>
                      <div className="text-[10px] font-medium text-[#86868B]">{weekdayFormatter.format(item.date)}</div>
                      <div className="mt-0.5 text-[11px] font-medium text-[#1D1D1F]">{item.label}</div>
                      <div className="mt-1 text-[11px] text-[#6E6E73]">{item.count ? `${item.count} ${c.scheduledTasks}` : c.restDay}</div>
                    </div>
                  );
                })}
              </div>
            </div>
            <button type="button" onClick={() => setWeekOffset((value) => value + 1)} className="grid min-h-14 place-items-center rounded-[12px] bg-white/70 text-[#86868B] ring-1 ring-black/[0.04] transition hover:bg-white hover:text-[#1D1D1F] focus:outline-none focus:ring-4 focus:ring-black/10" aria-label={c.nextWeek} title={c.nextWeek}><ChevronRight className="h-4 w-4" /></button>
          </div>
        </div>
      </Card>
    );
  }

  function renderTaskTypeMeta(projectId, task) {
    const key = `${task.id}:type`;
    const options = TASK_TYPES.includes(task.type) ? TASK_TYPES : [task.type, ...TASK_TYPES];
    if (editingTaskMeta === key) {
      return (
        <select
          autoFocus
          value={task.type}
          onChange={(event) => {
            updateTaskMeta(projectId, task.id, "type", event.target.value);
            setEditingTaskMeta(null);
          }}
          onBlur={() => setEditingTaskMeta(null)}
          className="min-h-8 rounded-[9px] border-0 bg-[#F0F7FF] px-2 text-[11px] font-medium text-[#007AFF] outline-none ring-1 ring-[#007AFF]/10 focus:ring-4 focus:ring-[#007AFF]/15"
        >
          {options.map((type) => <option key={type} value={type}>{labelFor(lang, "taskType", type)}</option>)}
        </select>
      );
    }
    return (
      <button type="button" onClick={() => setEditingTaskMeta(key)} className="inline-flex min-h-8 items-center rounded-[9px] bg-[#F0F7FF] px-2 text-[11px] font-medium text-[#007AFF] ring-1 ring-[#007AFF]/10 transition hover:bg-[#E4F1FF] focus:outline-none focus:ring-4 focus:ring-[#007AFF]/15" title={c.editTaskMeta}>
        {labelFor(lang, "taskType", task.type)}
      </button>
    );
  }

  function renderTaskWeightMeta(projectId, task) {
    const key = `${task.id}:weight`;
    if (editingTaskMeta === key) {
      return (
        <select
          autoFocus
          value={task.weight}
          onChange={(event) => {
            updateTaskMeta(projectId, task.id, "weight", event.target.value);
            setEditingTaskMeta(null);
          }}
          onBlur={() => setEditingTaskMeta(null)}
          className="min-h-8 rounded-[9px] border-0 bg-[#FFF6D6] px-2 text-[11px] font-medium text-[#8A6400] outline-none ring-1 ring-[#FFD60A]/25 focus:ring-4 focus:ring-[#FFD60A]/20"
        >
          {TASK_WEIGHTS.map((weight) => <option key={weight} value={weight}>+{weight}%</option>)}
        </select>
      );
    }
    return (
      <button type="button" onClick={() => setEditingTaskMeta(key)} className="inline-flex min-h-8 items-center rounded-[9px] bg-[#FFF6D6] px-2 text-[11px] font-medium text-[#8A6400] ring-1 ring-[#FFD60A]/25 transition hover:bg-[#FFF0B8] focus:outline-none focus:ring-4 focus:ring-[#FFD60A]/20" title={c.editTaskMeta}>
        +{task.weight}%
      </button>
    );
  }

  function renderTaskDateMeta(projectId, task) {
    const key = `${task.id}:date`;
    if (editingTaskMeta === key) {
      return (
        <input
          autoFocus
          type="date"
          value={task.scheduledDate || ""}
          onChange={(event) => updateTaskMeta(projectId, task.id, "scheduledDate", event.target.value)}
          onBlur={() => setEditingTaskMeta(null)}
          className="min-h-8 rounded-[9px] border-0 bg-[#F5F5F7] px-2 text-[11px] font-medium text-[#6E6E73] outline-none ring-1 ring-black/[0.05] focus:ring-4 focus:ring-black/10"
        />
      );
    }
    return (
      <button type="button" onClick={() => setEditingTaskMeta(key)} className="inline-flex min-h-8 items-center rounded-[9px] bg-[#F5F5F7] px-2 text-[11px] font-medium text-[#6E6E73] ring-1 ring-black/[0.05] transition hover:bg-[#ECECEF] focus:outline-none focus:ring-4 focus:ring-black/10" title={c.taskDate}>
        {task.scheduledDate || c.noTaskDate}
      </button>
    );
  }

  function renderTaskListCard() {
    return (
      <Card className="p-5">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <h3 className="text-[20px] font-medium tracking-[-0.025em]">{c.questLog}</h3>
            <p className="mt-1.5 text-[13px] font-normal text-[#86868B]">{c.questLogDesc}</p>
          </div>
          <button type="button" onClick={() => setTaskModalOpen(true)} className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#1D1D1F] text-white shadow-sm transition hover:bg-black focus:outline-none focus:ring-4 focus:ring-black/10" aria-label="add task"><Plus className="h-5 w-5" /></button>
        </div>
        {selected && orderedTasksOf(selected).length ? (
          <div className="divide-y divide-black/[0.06]">
            {orderedTasksOf(selected).map((task) => {
              return (
                <div key={task.id} draggable onDragStart={() => selected && setDraggingTask({ projectId: selected.id, taskId: task.id })} onDragOver={(event) => event.preventDefault()} onDrop={() => { if (selected && draggingTask?.projectId === selected.id) reorderTaskInProject(selected.id, draggingTask.taskId, task.id); setDraggingTask(null); }} className="group flex w-full gap-3 py-4 text-left transition first:pt-0 last:pb-0">
                  <div className="mt-1 grid h-8 w-5 shrink-0 cursor-grab place-items-center rounded-full text-[14px] text-[#C7C7CC] active:cursor-grabbing">⋮⋮</div>
                  <button type="button" onClick={() => completeTask(selected.id, task.id)} className="mt-1 grid h-11 w-11 shrink-0 place-items-center rounded-full transition focus:outline-none focus:ring-4 focus:ring-black/10" aria-label={c.complete}>
                    <span className={cx("grid h-6 w-6 place-items-center rounded-full border transition", task.done ? "border-[#34C759] bg-[#34C759] text-white" : "border-[#C7C7CC] bg-transparent text-transparent group-hover:border-[#8E8E93] group-hover:text-[#8E8E93]")}>{task.done ? <Check className="h-3.5 w-3.5" /> : <Circle className="h-3 w-3" />}</span>
                  </button>
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      {renderTaskTypeMeta(selected.id, task)}
                      {renderTaskWeightMeta(selected.id, task)}
                      {renderTaskDateMeta(selected.id, task)}
                      {task.scheduledDate && <button type="button" onClick={() => updateTaskMeta(selected.id, task.id, "scheduledDate", "")} className="inline-flex min-h-8 items-center rounded-[9px] px-2 text-[11px] font-medium text-[#A1A1A6] transition hover:bg-[#F5F5F7] hover:text-[#D93025] focus:outline-none focus:ring-4 focus:ring-black/10" title={c.clearDate}>×</button>}
                    </div>
                    <div className={cx("break-words text-[17px] font-medium tracking-[-0.01em]", task.done && "text-[#34A853] line-through")}>{task.title}</div>
                    <textarea data-autosize="true" value={task.action || ""} onChange={(event) => selected && handleTaskActionChange(selected.id, task.id, event)} rows={1} className="mt-2 min-h-11 w-full resize-none overflow-hidden rounded-[12px] border-0 bg-[#F5F5F7] px-3 py-2 text-[13px] leading-5 text-[#6E6E73] outline-none transition focus:bg-white focus:ring-4 focus:ring-black/10" placeholder={c.nodeDescPlaceholder} />
                    {task.focusMode && <div className="mt-2 rounded-[14px] bg-[#FFF8E7] p-3 ring-1 ring-[#FFD60A]/25"><div className="mb-1 text-[12px] font-medium text-[#8A6400]">{c.fiveMinuteLabel}</div><textarea data-autosize="true" value={task.focusAction || ""} onChange={(event) => { resizeTextarea(event.currentTarget); selected && updateTaskFocusAction(selected.id, task.id, event.target.value); }} rows={2} className="w-full resize-none overflow-hidden rounded-[10px] border-0 bg-white/60 px-3 py-2 text-[13px] leading-5 text-[#6E5B20] outline-none focus:ring-4 focus:ring-[#FFD60A]/20" /></div>}
                  </div>
                  <button type="button" onClick={() => selected && deleteTask(selected.id, task.id)} className="mt-1 grid h-11 w-11 shrink-0 place-items-center rounded-full text-[#A1A1A6] transition hover:bg-[#F5F5F7] hover:text-[#D93025] focus:outline-none focus:ring-4 focus:ring-black/10"><Trash2 className="h-4 w-4" /></button>
                </div>
              );
            })}
          </div>
        ) : <EmptyState>{c.noTasks}</EmptyState>}
      </Card>
    );
  }

  function renderDashboardPage() {
    return (
      <main className="relative mx-auto max-w-[1180px] px-4 py-5 sm:px-8 sm:py-6 lg:py-3">
        <header className="mb-3">
          <div className="max-w-[780px]">
            <h1 className="text-[34px] font-medium leading-[1.04] tracking-[-0.045em] text-[#1D1D1F] sm:text-[42px]">{c.boardTitle}</h1>
            <p className="mt-2 text-[14px] leading-6 text-[#86868B] sm:text-[15px]">{c.boardDesc}</p>
          </div>
        </header>
        <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
          <div className="space-y-3">
            {renderProjectOverviewCard()}
            <div className="lg:hidden">{renderProjectSwitcher()}</div>
            {renderProjectInsightsCard()}
            {renderBlockerHistory()}
            {renderTaskListCard()}
          </div>
          <aside className="hidden lg:block">{renderProjectSwitcher()}</aside>
        </section>
        {renderAddTaskModal()}
        {renderProjectManagerModal()}
      </main>
    );
  }

  function renderReadyTaskActions(project, task, compact = false) {
    return (
      <div className={cx("grid gap-2", compact ? "grid-cols-2 [&>button:last-child]:col-span-2" : "sm:w-44")}>
        <Button onClick={() => completeTask(project.id, task.id)} variant="green" disabled={project.paused} className="w-full"><Check className="h-4 w-4" /> {c.complete}</Button>
        <Button onClick={() => { setSelectedId(project.id); setActivePage("dashboard"); }} variant="light" className="w-full">{c.enterProject}</Button>
        <button type="button" onClick={() => toggleFiveMinute(project.id, task.id)} className={cx("min-h-11 rounded-full px-3 text-[13px] font-medium transition focus:outline-none focus:ring-4 focus:ring-black/10", task.focusMode ? "bg-[#FFF8E7] text-[#8A6400] ring-1 ring-[#FFD60A]/25 hover:bg-[#FFF3C4]" : "bg-[#F5F5F7] text-[#6E6E73] hover:bg-[#ECECEF]")}>{task.focusMode ? c.cancelTiny : c.tiny}</button>
      </div>
    );
  }

  function renderPrimaryReadyTask(item) {
    const { project, task, progress: itemProgress } = item;
    const pt = tintMap[project.tint] || tintMap.blue;
    return (
      <Card key={project.id} draggable onDragStart={() => setDraggingProjectId(project.id)} onDragOver={(event) => event.preventDefault()} onDrop={() => { reorderProjectById(draggingProjectId, project.id); setDraggingProjectId(null); }} className="flex min-w-0 flex-col p-5">
        <div className="mb-3 flex min-w-0 items-center gap-3">
          <span className="cursor-grab text-[#C7C7CC]" aria-hidden="true">⋮⋮</span>
          <Folder className="h-5 w-5 shrink-0 text-[#007AFF]" />
          <span className="min-w-0 break-words text-[13px] text-[#6E6E73]">{project.title}</span>
        </div>
        <div className="mb-3 flex flex-wrap gap-2">
          <PixelBadge tone={project.paused ? "neutral" : "blue"}>{project.paused ? c.statusSealed : c.statusActive}</PixelBadge>
          {project.stuck && <PixelBadge tone="red"><CircleAlert className="h-3 w-3" />{c.rescue}</PixelBadge>}
          <PixelBadge tone="neutral">{labelFor(lang, "taskType", task.type)}</PixelBadge>
        </div>
        <h2 className="break-words text-[18px] font-medium leading-6">{task.title}</h2>
        <p className="mt-2 whitespace-pre-wrap break-words text-[13px] leading-5 text-[#6E6E73]">{task.action}</p>
        {task.focusMode && (
          <div className="mt-3 rounded-[12px] bg-[#FFF8E7] p-3">
            <div className="mb-1 text-[12px] text-[#8A6400]">{c.fiveMinuteLabel}</div>
            <textarea aria-label={c.fiveMinuteLabel} data-autosize="true" value={task.focusAction || ""} onChange={(event) => { resizeTextarea(event.currentTarget); updateTaskFocusAction(project.id, task.id, event.target.value); }} rows={2} className="w-full resize-none overflow-hidden rounded-[8px] bg-white/70 px-2 py-2 text-[13px] leading-5 outline-none focus:ring-2 focus:ring-[#FFD60A]/25" />
          </div>
        )}
        <div className="mt-auto pt-4">
          <div className="mb-3 flex items-center gap-3">
            <span className="text-[12px] tabular-nums text-[#86868B]">{itemProgress}%</span>
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#E5E5EA]"><div className={cx("h-full rounded-full", pt.bar)} style={{ width: `${itemProgress}%` }} /></div>
          </div>
          {renderReadyTaskActions(project, task, true)}
        </div>
      </Card>
    );
  }

  function renderFiveMinuteInfoCard() {
    const icons = [CircleAlert, PlayCircle, Target];
    return (
      <Card className="p-5 sm:p-6">
        <div className="mb-5 flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#F5F5F7] text-[#6E6E73]"><PlayCircle className="h-5 w-5" /></span>
          <h3 className="text-[20px] font-medium tracking-[-0.025em]">{c.whyFiveTitle}</h3>
        </div>
        <div className="space-y-4">
          {c.whyFiveItems.map(([title, text], index) => {
            const Icon = icons[index] || CheckSquare;
            return (
              <div key={title} className="flex gap-3">
                <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#F5F5F7] text-[#007AFF] ring-1 ring-black/[0.04]"><Icon className="h-4 w-4" /></span>
                <div className="min-w-0">
                  <div className="text-[14px] font-medium text-[#1D1D1F]">{title}</div>
                  <p className="mt-1 text-[13px] leading-5 text-[#86868B]">{text}</p>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-6 border-t border-black/[0.06] pt-4 text-[13px] leading-6 text-[#86868B]">“{c.whyFiveHint}”</div>
      </Card>
    );
  }

  function renderOtherReadyTasks(items) {
    if (!items.length) return null;
    return (
      <Card className="p-5 sm:p-6">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <h3 className="text-[20px] font-medium tracking-[-0.025em]">{c.otherReadyTasks}</h3>
            <p className="mt-1 text-[13px] leading-5 text-[#86868B]">{c.nowDesc}</p>
          </div>
          <PixelBadge tone="neutral">{items.length}</PixelBadge>
        </div>
        <div className="space-y-3">
          {items.map(({ project, task, progress: itemProgress }) => {
            const pt = tintMap[project.tint] || tintMap.blue;
            return (
              <div key={`${project.id}-${task.id}`} draggable onDragStart={() => setDraggingProjectId(project.id)} onDragOver={(event) => event.preventDefault()} onDrop={() => { reorderProjectById(draggingProjectId, project.id); setDraggingProjectId(null); }} className="rounded-[18px] bg-[#F5F5F7] p-4 ring-1 ring-black/[0.03]">
                <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(220px,auto)] lg:items-center">
                  <div className="min-w-0">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span className="grid h-8 w-5 cursor-grab place-items-center rounded-full text-[14px] text-[#C7C7CC] active:cursor-grabbing">⋮⋮</span>
                      <PixelBadge tone="neutral">{project.title}</PixelBadge>
                      <PixelBadge tone={isMilestoneTask(task.type) ? "red" : "gold"}>{labelFor(lang, "taskType", task.type)}</PixelBadge>
                      <span className="text-[12px] text-[#86868B]">{itemProgress}%</span>
                    </div>
                    <div className="break-words text-[17px] font-medium tracking-[-0.01em]">{task.title}</div>
                    <p className="mt-1 break-words text-[13px] leading-5 text-[#6E6E73]">{task.action}</p>
                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#E5E5EA]"><div className={cx("h-full rounded-full", pt.bar)} style={{ width: `${itemProgress}%` }} /></div>
                  </div>
                  {renderReadyTaskActions(project, task, true)}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    );
  }

  function renderNowPage() {
    return (
      <main className="relative mx-auto max-w-[1320px] px-4 py-6 sm:px-8 sm:py-8">
        <header className="mb-5 max-w-2xl">
          <h1 className="text-[36px] font-medium leading-[1.05] tracking-[-0.045em] text-[#1D1D1F] sm:text-[54px]">{c.nowTitle}</h1>
          <p className="mt-5 max-w-xl text-[15px] leading-6 text-[#86868B] sm:text-[16px]">{c.nowDesc}</p>
        </header>

        <div className="mb-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-stretch">
          <Card className="p-4 sm:p-5">
            <div className="flex flex-wrap gap-2">{[["active", c.filters.active], ["all", c.filters.all], ["boss", c.filters.boss], ["sealed", c.filters.sealed]].map(([value, label]) => <button key={value} type="button" onClick={() => setNextFilter(value)} className={cx("min-h-11 rounded-full px-4 py-2 text-[14px] font-medium transition focus:outline-none focus:ring-4 focus:ring-black/10", nextFilter === value ? "bg-[#1D1D1F] text-white" : "bg-[#F5F5F7] text-[#6E6E73] hover:bg-[#ECECEF]")}>{label}</button>)}</div>
          </Card>
          <Card className="flex items-center justify-between gap-4 p-5">
            <div className="flex items-center gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#FFF8E7] text-[#8A6400] ring-1 ring-[#FFD60A]/25"><PlayCircle className="h-5 w-5" /></span>
              <div>
                <div className="text-[13px] font-medium text-[#86868B]">{c.streakDays}</div>
                <div className="mt-1 text-[24px] font-medium tracking-[-0.04em] tabular-nums">{activityStreak} {c.dayUnit}</div>
              </div>
            </div>
            <PixelBadge tone="green">{filteredNextSteps.length} {lang === "zh" ? "项" : "steps"}</PixelBadge>
          </Card>
        </div>

        {filteredNextSteps.length ? (
          <section className="grid items-stretch gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredNextSteps.map(renderPrimaryReadyTask)}
          </section>
        ) : <EmptyState>{c.noNow}</EmptyState>}
        <details className="mt-5">
          <summary className="cursor-pointer py-3 text-[13px] text-[#6E6E73]">{c.whyFiveTitle}</summary>
          {renderFiveMinuteInfoCard()}
        </details>
      </main>
    );
  }

  const overviewTask = filteredNextSteps.length ? filteredNextSteps[todayStepIndex % filteredNextSteps.length] : null;
  const overviewProject = selected || activeProjects[0] || null;
  const overviewProjectProgress = overviewProject ? progressOf(overviewProject) : 0;
  const overviewProjectTint = tintMap[overviewProject?.tint] || tintMap.blue;
  const stuckProject = activeProjects.find((project) => project.stuck && !project.paused);
  const recentIdeas = activeIdeas.slice(0, 2);

  if (activePage === "home") {
    return appShell(
      <main className="relative mx-auto max-w-6xl px-4 py-7 sm:px-8 sm:py-12 lg:py-16">
        <section className="grid items-center gap-7 rounded-[28px] border border-white/70 bg-white/65 p-5 shadow-[0_24px_70px_rgba(15,23,42,0.045)] backdrop-blur sm:p-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:p-10">
          <div className="min-w-0">
            <div className="inline-flex min-h-9 items-center rounded-full bg-[#F5F5F7] px-3 text-[13px] font-medium text-[#6E6E73] ring-1 ring-black/[0.04]">{c.morningGreeting}</div>
            <h1 className="mt-5 max-w-3xl text-[34px] font-medium leading-[1.06] tracking-[-0.03em] text-[#1D1D1F] sm:text-[52px] sm:leading-[1.03] lg:text-[64px]">{c.heroTitle}</h1>
            <p className="mt-5 max-w-2xl text-[14px] leading-7 text-[#6E6E73] sm:text-[16px] sm:leading-7">{c.heroDesc}</p>
          </div>
          <div className="relative min-h-[260px] overflow-hidden rounded-[28px] bg-gradient-to-br from-[#F8FBFF] via-white to-[#F4F1FF] ring-1 ring-black/[0.04]">
            <div className="absolute -right-14 -top-14 h-44 w-44 rounded-full bg-[#BFD7FF]/45 blur-2xl" />
            <div className="absolute -bottom-16 left-4 h-52 w-52 rounded-full bg-[#DFF3E5]/65 blur-2xl" />
            <div className="absolute left-8 top-8 grid h-14 w-14 place-items-center rounded-2xl bg-white text-[#007AFF] shadow-sm ring-1 ring-black/[0.04]"><Flag className="h-6 w-6" /></div>
            <div className="absolute right-9 top-12 grid h-16 w-16 place-items-center rounded-full bg-white text-[#7C5CFF] shadow-sm ring-1 ring-black/[0.04]"><Target className="h-7 w-7" /></div>
            <div className="absolute bottom-9 left-10 right-10 h-24 rounded-[999px] border border-dashed border-[#B9C8E8]" />
            <div className="absolute bottom-16 left-16 h-3 w-3 rounded-full bg-[#007AFF]" />
            <div className="absolute bottom-28 left-1/2 h-3 w-3 rounded-full bg-[#34C759]" />
            <div className="absolute bottom-16 right-20 h-3 w-3 rounded-full bg-[#7C5CFF]" />
            <div className="absolute bottom-10 right-10 rounded-2xl bg-white/85 px-4 py-3 text-[13px] font-medium text-[#6E6E73] shadow-sm ring-1 ring-black/[0.04]">{filteredNextSteps.length} steps ready</div>
          </div>
        </section>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <HomeEntryCard icon={Folder} title={c.homeBoardTitle} description={c.homeBoardDesc} stat={`${activeProjects.length} projects`} tone="blue" onClick={() => setActivePage("dashboard")} />
          <HomeEntryCard icon={CheckSquare} title={c.homeNowTitle} description={c.homeNowDesc} stat={`${filteredNextSteps.length} steps`} tone="green" onClick={() => setActivePage("now")} />
          <HomeEntryCard icon={Lightbulb} title={c.homeIdeaTitle} description={c.homeIdeaDesc} stat={`${activeIdeas.length} ideas`} tone="purple" onClick={() => setActivePage("ideas")} />
          <HomeEntryCard icon={Archive} title={c.homeTrashTitle} description={c.homeTrashDesc} stat={`${trashCount} items`} tone="gray" onClick={() => setActivePage("trash")} />
        </section>

        <section className="mt-10">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-[24px] font-medium tracking-[-0.02em] text-[#1D1D1F] sm:text-[30px]">{c.todayOverview}</h2>
              <p className="mt-2 text-[14px] leading-6 text-[#86868B]">{c.todayOverviewDesc}</p>
            </div>
            <Button variant="light" onClick={() => setActivePage("dashboard")} className="w-full sm:w-auto"><Layers className="h-4 w-4" /> {c.customizeLayout}</Button>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="p-5 sm:p-6">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#F0FAF3] text-[#248A3D]"><PlayCircle className="h-5 w-5" /></span><h3 className="text-[20px] font-semibold tracking-[-0.02em]">{c.homeNowTitle}</h3></div>
                <PixelBadge tone="green">{filteredNextSteps.length}</PixelBadge>
              </div>
              {overviewTask ? (
                <div>
                  <div className="mb-3 flex flex-wrap items-center gap-2"><PixelBadge tone={isMilestoneTask(overviewTask.task.type) ? "red" : "blue"}>{labelFor(lang, "taskType", overviewTask.task.type)}</PixelBadge><PixelBadge tone="neutral">{overviewTask.project.title}</PixelBadge><PixelBadge tone="gold">{overviewTask.progress}%</PixelBadge></div>
                  <div className="break-words text-[20px] font-medium tracking-[-0.02em] text-[#1D1D1F]">{overviewTask.task.title}</div>
                  <p className="mt-2 break-words text-[14px] leading-6 text-[#6E6E73]">{overviewTask.task.action}</p>
                  <div className="mt-5 flex flex-col gap-2 sm:flex-row"><Button onClick={() => toggleFiveMinute(overviewTask.project.id, overviewTask.task.id)} variant="green" className="w-full sm:w-auto"><PlayCircle className="h-4 w-4" /> {c.continueFive}</Button><Button onClick={() => setTodayStepIndex((value) => (filteredNextSteps.length ? (value + 1) % filteredNextSteps.length : 0))} variant="light" className="w-full sm:w-auto"><RefreshCw className="h-4 w-4" /> {c.switchTask}</Button></div>
                </div>
              ) : <EmptyState>{c.noOverviewTask}</EmptyState>}
            </Card>

            <Card className="p-5 sm:p-6">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#F0F7FF] text-[#007AFF]"><Folder className="h-5 w-5" /></span><h3 className="text-[20px] font-semibold tracking-[-0.02em]">{c.currentProject}</h3></div>
                {overviewProject && <PixelBadge tone={overviewProject.paused ? "neutral" : "blue"}>{overviewProject.paused ? c.statusSealed : c.statusActive}</PixelBadge>}
              </div>
              {overviewProject ? (
                <div>
                  <div className="flex items-start gap-3"><PixelIcon className={cx("h-12 w-12 rounded-2xl text-xl", overviewProjectTint.bg)}>{overviewProject.icon}</PixelIcon><div className="min-w-0 flex-1"><div className="break-words text-[20px] font-medium tracking-[-0.02em]">{overviewProject.title}</div><p className="mt-1 break-words text-[14px] leading-6 text-[#6E6E73]">{overviewProject.subtitle || overviewProject.status}</p></div></div>
                  <div className="mt-5 flex items-center gap-3"><span className="w-10 text-[13px] font-medium tabular-nums text-[#6E6E73]">{overviewProjectProgress}%</span><div className="h-2 flex-1 overflow-hidden rounded-full bg-[#E5E5EA]"><div className={cx("h-full rounded-full", overviewProjectTint.bar)} style={{ width: `${overviewProjectProgress}%` }} /></div></div>
                  <div className="mt-5 flex flex-wrap gap-2"><Button onClick={() => toggleProjectStuck(overviewProject.id)} variant="light" disabled={overviewProject.paused} className={overviewProject.paused ? "opacity-50" : ""}><CircleAlert className="h-4 w-4" /> {overviewProject.stuck ? c.closeJail : c.rescue}</Button><Button onClick={() => toggleProjectPaused(overviewProject.id)} variant="light"><PauseCircle className="h-4 w-4" /> {overviewProject.paused ? c.unseal : c.seal}</Button><Button onClick={() => { setSelectedId(overviewProject.id); setActivePage("dashboard"); }} variant="light">{c.viewDetails}</Button></div>
                </div>
              ) : <EmptyState>{c.noProject}</EmptyState>}
            </Card>

            <Card className="p-5 sm:p-6">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#F4F1FF] text-[#7C5CFF]"><StickyNote className="h-5 w-5" /></span><h3 className="text-[20px] font-semibold tracking-[-0.02em]">{c.recentIdeas}</h3></div>
                <button type="button" onClick={() => setActivePage("ideas")} className="min-h-11 rounded-full px-3 text-[13px] font-medium text-[#007AFF] transition hover:bg-[#F0F7FF] focus:outline-none focus:ring-4 focus:ring-black/10">{c.allQuickNotes}</button>
              </div>
              {recentIdeas.length ? <div className="space-y-3">{recentIdeas.map((idea) => <div key={idea.id} className="flex items-start gap-3 rounded-[16px] bg-[#F5F5F7] p-3"><Lightbulb className="mt-1 h-4 w-4 shrink-0 text-[#7C5CFF]" /><div className="min-w-0 flex-1"><div className="break-words text-[14px] leading-6 text-[#1D1D1F]">{idea.text}</div><div className="mt-2 flex flex-wrap items-center gap-2"><PixelBadge tone="neutral">{labelFor(lang, "ideaCategory", idea.category || "灵感")}</PixelBadge><span className="text-[12px] text-[#9A9AA0]">{formatTime(idea.createdAt)}</span></div></div><button type="button" className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-[#A1A1A6] transition hover:bg-white hover:text-[#1D1D1F] focus:outline-none focus:ring-4 focus:ring-black/10" aria-label="more"><MoreHorizontal className="h-4 w-4" /></button></div>)}</div> : <EmptyState>{c.emptyIdeas}</EmptyState>}
            </Card>

            <Card className="p-5 sm:p-6">
              <div className="mb-5 flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#FFF1EF] text-[#D93025]"><AlertTriangle className="h-5 w-5" /></span><h3 className="text-[20px] font-semibold tracking-[-0.02em]">{c.blockerReminder}</h3></div>
              {stuckProject ? (
                <div>
                  <div className="break-words text-[20px] font-medium tracking-[-0.02em]">{stuckProject.title}</div>
                  <div className="mt-4 grid gap-3">
                    <div className="rounded-[16px] bg-[#FFF8F6] p-3"><div className="mb-1 text-[12px] font-semibold text-[#D93025]">{c.jailReasonTitle}</div><p className="break-words text-[14px] leading-6 text-[#6E6E73]">{stuckProject.stuckReason || c.jailReasonPlaceholder}</p></div>
                    <div className="rounded-[16px] bg-[#F5F5F7] p-3"><div className="mb-1 text-[12px] font-medium text-[#1D1D1F]">{c.jailPlanTitle}</div><p className="break-words text-[14px] leading-6 text-[#6E6E73]">{stuckProject.stuckPlan || c.jailPlanPlaceholder}</p></div>
                  </div>
                  <Button onClick={() => { setSelectedId(stuckProject.id); setActivePage("dashboard"); }} variant="light" className="mt-5 w-full sm:w-auto"><CircleAlert className="h-4 w-4" /> {c.handleBlocker}</Button>
                </div>
              ) : <EmptyState>{c.noBlocker}</EmptyState>}
            </Card>
          </div>
        </section>

        <p className="mx-auto mt-10 max-w-2xl text-center text-[14px] leading-6 text-[#86868B]">{c.homeHint}</p>
      </main>
    );
  }

  if (activePage === "ideas") {
    return appShell(
      <main className="relative mx-auto max-w-5xl px-5 py-12 sm:px-8 lg:py-16"><header className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"><div><h1 className="text-[36px] font-medium leading-[1.05] tracking-[-0.045em] sm:text-[54px]">{c.ideaTitle}</h1><p className="mt-5 max-w-xl text-[15px] leading-6 text-[#86868B] sm:text-[16px]">{c.ideaDesc}</p></div><PixelBadge tone="gold">{activeIdeas.length} ideas</PixelBadge></header><Card className="mb-8 p-5 sm:p-6"><div className="grid gap-3 sm:grid-cols-[1fr_160px_auto] sm:items-end"><div><div className="mb-1 text-[13px] font-medium text-[#86868B]">{c.quickIdea}</div><input value={thought} onChange={(event) => setThought(event.target.value)} onKeyDown={(event) => event.key === "Enter" && addThought()} placeholder={lang === "zh" ? "突然想到什么，先丢进这里..." : "Drop a quick thought here..."} className="min-h-12 w-full rounded-[14px] border-0 bg-[#F5F5F7] px-4 text-[15px] outline-none transition placeholder:text-[#A1A1A6] focus:bg-white focus:ring-4 focus:ring-black/10" /></div><select value={newIdeaCategory} onChange={(event) => setNewIdeaCategory(event.target.value)} className="min-h-12 rounded-[14px] border-0 bg-[#F5F5F7] px-4 text-[14px] font-medium text-[#6E6E73] outline-none focus:bg-white focus:ring-4 focus:ring-black/10">{IDEA_CATEGORIES.filter((category) => category !== "全部").map((category) => <option key={category} value={category}>{labelFor(lang, "ideaCategory", category)}</option>)}</select><Button onClick={addThought}><Plus className="h-4 w-4" /> {c.saveIdea}</Button></div></Card><Card className="p-5 sm:p-6"><div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-[20px] font-medium tracking-[-0.02em]">{c.allIdeas}</h2><p className="mt-1 text-[13px] text-[#86868B]">{c.ideasHint}</p></div><div className="flex flex-col gap-2 sm:flex-row"><div className="flex rounded-full bg-[#F5F5F7] p-1"><button type="button" onClick={() => setIdeaView("list")} className={cx("rounded-full px-3 py-2 text-[13px] font-medium transition", ideaView === "list" ? "bg-white text-[#1D1D1F] shadow-sm" : "text-[#86868B]")}>{c.ideaViewList}</button><button type="button" onClick={() => setIdeaView("bubble")} className={cx("rounded-full px-3 py-2 text-[13px] font-medium transition", ideaView === "bubble" ? "bg-white text-[#1D1D1F] shadow-sm" : "text-[#86868B]")}>{c.ideaViewBubble}</button></div><select value={ideaCategoryFilter} onChange={(event) => setIdeaCategoryFilter(event.target.value)} className="min-h-11 rounded-full border-0 bg-[#F5F5F7] px-4 text-[14px] font-medium text-[#6E6E73] outline-none focus:bg-white focus:ring-4 focus:ring-black/10">{IDEA_CATEGORIES.map((category) => <option key={category} value={category}>{labelFor(lang, "ideaCategory", category)}</option>)}</select><div className="relative w-full sm:w-64"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A1A1A6]" /><input value={ideaSearch} onChange={(event) => setIdeaSearch(event.target.value)} placeholder={c.searchIdeas} className="min-h-11 w-full rounded-full border-0 bg-[#F5F5F7] pl-9 pr-4 text-[14px] outline-none transition placeholder:text-[#A1A1A6] focus:bg-white focus:ring-4 focus:ring-black/10" /></div></div></div>{ideaView === "bubble" ? <div className="flex flex-wrap gap-3">{filteredIdeas.map((idea) => <div key={idea.id} className="group inline-flex items-center gap-2 rounded-full bg-[#F5F5F7] px-4 py-2 text-[13px] text-[#3A3A3C] ring-1 ring-black/[0.04]"><span>{idea.text}</span><button type="button" onClick={() => deleteIdea(idea.id)} className="grid h-5 w-5 place-items-center rounded-full text-[#A1A1A6] opacity-0 transition group-hover:opacity-100 hover:bg-white hover:text-[#D93025]" aria-label="delete idea bubble">×</button></div>)}</div> : renderIdeaList(true)}</Card></main>
    );
  }

  if (activePage === "trash") {
    return appShell(
      <main className="relative mx-auto max-w-4xl px-5 py-12 sm:px-8 lg:py-16"><header className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"><div><h1 className="text-[36px] font-medium leading-[1.05] tracking-[-0.045em] sm:text-[54px]">{c.trashTitle}</h1><p className="mt-5 max-w-xl text-[15px] leading-6 text-[#86868B] sm:text-[16px]">{c.trashDesc}</p></div><PixelBadge tone="red">{trashCount} items</PixelBadge></header><div className="space-y-8"><Card className="p-5 sm:p-6"><div className="mb-5 flex items-center justify-between"><div><h2 className="text-[20px] font-medium tracking-[-0.02em]">{c.deletedIdeas}</h2><p className="mt-1 text-[13px] text-[#86868B]">{c.restoreIdeaHint}</p></div><PixelBadge tone="neutral">{trashIdeas.length}</PixelBadge></div>{trashIdeas.length ? <div className="space-y-3">{trashIdeas.map((idea) => <div key={idea.id} className="rounded-[16px] bg-[#F5F5F7] p-4"><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><div className="text-[15px] font-semibold">{idea.text}</div><div className="mt-1 text-[12px] text-[#86868B]">{c.remaining} {daysLeftInTrash(idea)} {c.days} · {c.deletedAt} {formatTime(idea.deletedAt)}</div></div><div className="flex gap-2"><Button onClick={() => restoreIdea(idea.id)} variant="green"><RotateCcw className="h-4 w-4" /> {c.restore}</Button><Button onClick={() => permanentlyDeleteIdea(idea.id)} variant="light"><Trash2 className="h-4 w-4" /> {c.permanentDelete}</Button></div></div></div>)}</div> : <EmptyState>{c.noTrashIdeas}</EmptyState>}</Card><Card className="p-5 sm:p-6"><div className="mb-5 flex items-center justify-between"><div><h2 className="text-[20px] font-medium tracking-[-0.02em]">{c.deletedProjects}</h2><p className="mt-1 text-[13px] text-[#86868B]">{c.restoreProjectHint}</p></div><PixelBadge tone="neutral">{trashProjects.length}</PixelBadge></div>{trashProjects.length ? <div className="space-y-3">{trashProjects.map((project) => <div key={project.id} className="rounded-[16px] bg-[#F5F5F7] p-4"><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div className="text-[15px] font-semibold">{project.title}</div><div className="flex gap-2"><Button onClick={() => restoreProject(project.id)} variant="green"><RotateCcw className="h-4 w-4" /> {c.restore}</Button><Button onClick={() => permanentlyDeleteProject(project.id)} variant="light"><Trash2 className="h-4 w-4" /> {c.permanentDelete}</Button></div></div></div>)}</div> : <EmptyState>{c.noTrashProjects}</EmptyState>}</Card><Card className="p-5 sm:p-6"><div className="mb-5 flex items-center justify-between"><div><h2 className="text-[20px] font-medium tracking-[-0.02em]">{c.deletedTasks}</h2><p className="mt-1 text-[13px] text-[#86868B]">{c.restoreTaskHint}</p></div><PixelBadge tone="neutral">{trashTasks.length}</PixelBadge></div>{trashTasks.length ? <div className="space-y-3">{trashTasks.map(({ project, task }) => <div key={`${project.id}-${task.id}`} className="rounded-[16px] bg-[#F5F5F7] p-4"><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><PixelBadge tone="blue">{project.title}</PixelBadge><div className="mt-2 text-[15px] font-semibold">{task.title}</div></div><div className="flex gap-2"><Button onClick={() => restoreTask(project.id, task.id)} variant="green"><RotateCcw className="h-4 w-4" /> {c.restore}</Button><Button onClick={() => permanentlyDeleteTask(project.id, task.id)} variant="light"><Trash2 className="h-4 w-4" /> {c.permanentDelete}</Button></div></div></div>)}</div> : <EmptyState>{c.noTrashTasks}</EmptyState>}</Card></div></main>
    );
  }

  if (activePage === "dashboard") {
    return appShell(renderDashboardPage());
  }

  if (activePage === "now") {
    return appShell(renderNowPage());
  }

  if (activePage === "now") {
    return appShell(
      <main className="relative mx-auto max-w-5xl px-5 py-12 sm:px-8 lg:py-16"><header className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"><div><h1 className="text-[36px] font-medium leading-[1.05] tracking-[-0.045em] sm:text-[54px]">{c.nowTitle}</h1><p className="mt-5 max-w-xl text-[15px] leading-6 text-[#86868B] sm:text-[16px]">{c.nowDesc}</p></div><PixelBadge tone="green">{filteredNextSteps.length} steps</PixelBadge></header><Card className="mb-8 p-4 sm:p-5"><div className="flex flex-wrap gap-2">{[["active", c.filters.active], ["all", c.filters.all], ["boss", c.filters.boss], ["sealed", c.filters.sealed]].map(([value, label]) => <button key={value} type="button" onClick={() => setNextFilter(value)} className={cx("min-h-11 rounded-full px-4 py-2 text-[14px] font-medium transition focus:outline-none focus:ring-4 focus:ring-black/10", nextFilter === value ? "bg-[#1D1D1F] text-white" : "bg-[#F5F5F7] text-[#6E6E73] hover:bg-[#ECECEF]")}>{label}</button>)}</div></Card>{filteredNextSteps.length ? <div className="grid gap-5">{filteredNextSteps.map(({ project, task, progress: itemProgress }) => { const pt = tintMap[project.tint] || tintMap.blue; return <Card key={`${project.id}-${task.id}`} draggable onDragStart={() => setDraggingProjectId(project.id)} onDragOver={(event) => event.preventDefault()} onDrop={() => { reorderProjectById(draggingProjectId, project.id); setDraggingProjectId(null); }} className="p-5 sm:p-6"><div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between"><div className="flex min-w-0 flex-1 gap-4"><div className="mt-2 grid h-8 w-5 shrink-0 cursor-grab place-items-center rounded-full text-[14px] text-[#C7C7CC] active:cursor-grabbing">⋮⋮</div><PixelIcon className={cx("h-12 w-12 rounded-xl text-2xl", pt.bg)}>{project.icon}</PixelIcon><div className="min-w-0 flex-1"><div className="mb-2 flex flex-wrap items-center gap-2"><PixelBadge tone={project.paused ? "neutral" : "blue"}>{project.paused ? c.statusSealed : c.statusActive}</PixelBadge>{project.stuck && <PixelBadge tone="red"><CircleAlert className="h-3 w-3" /> {c.rescue}</PixelBadge>}<PixelBadge tone={isMilestoneTask(task.type) ? "red" : "gold"}>{labelFor(lang, "taskType", task.type)}</PixelBadge><span className="text-[13px] text-[#86868B]">{project.title}</span></div><h2 className="text-[20px] font-medium tracking-[-0.02em]">{task.title}</h2><p className="mt-2 text-[15px] leading-7 text-[#6E6E73]">{task.action}</p>{task.focusMode && <div className="mt-4 rounded-[16px] bg-[#FFF8E7] p-4 ring-1 ring-[#FFD60A]/25"><div className="mb-1 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between"><div className="text-[13px] font-medium text-[#8A6400]">{c.fiveMinuteLabel}</div><div className="text-[12px] text-[#A37A00]">{c.fiveMinuteHint}</div></div><textarea value={task.focusAction || ""} onChange={(event) => updateTaskFocusAction(project.id, task.id, event.target.value)} rows={2} className="mt-2 w-full resize-none rounded-[12px] border-0 bg-white/70 px-3 py-2 text-[14px] leading-6 text-[#6E5B20] outline-none transition focus:ring-4 focus:ring-[#FFD60A]/20" /></div>}<div className="mt-4 flex items-center gap-3 text-[12px] text-[#9A9AA0]"><span className="w-9 tabular-nums">{itemProgress}%</span><div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#E5E5EA]"><div className={cx("h-full rounded-full", pt.bar)} style={{ width: `${itemProgress}%` }} /></div></div></div></div><div className="grid shrink-0 grid-cols-1 gap-2 sm:w-40"><Button onClick={() => completeTask(project.id, task.id)} variant="green" className="w-full"><Check className="h-4 w-4" /> {c.complete}</Button><Button onClick={() => { setSelectedId(project.id); setActivePage("dashboard"); }} variant="light" className="w-full">{c.enterProject}</Button><button type="button" onClick={() => toggleFiveMinute(project.id, task.id)} className={cx("min-h-11 rounded-full px-3 text-[13px] font-medium transition focus:outline-none focus:ring-4 focus:ring-black/10", task.focusMode ? "bg-[#FFF8E7] text-[#8A6400] ring-1 ring-[#FFD60A]/25 hover:bg-[#FFF3C4]" : "bg-[#F5F5F7] text-[#6E6E73] hover:bg-[#ECECEF]")}>{task.focusMode ? c.cancelTiny : c.tiny}</button></div></div></Card>; })}</div> : <EmptyState>{c.noNow}</EmptyState>}</main>
    );
  }

  return appShell(
    <main className="relative mx-auto max-w-6xl px-5 py-12 sm:px-8 lg:py-16"><header className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"><div className="max-w-2xl"><h1 className="text-[36px] font-medium leading-[1.05] tracking-[-0.045em] text-[#1D1D1F] sm:text-[52px]">{c.boardTitle}</h1><p className="mt-5 max-w-3xl truncate text-[15px] leading-6 text-[#86868B] sm:text-[16px]">{c.boardDesc}</p></div></header><section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start"><div className="space-y-8"><Card className="p-7 sm:p-8">{selected ? <><div className="mb-8 grid gap-5 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-start"><PixelIcon className={tint.bg}>{selected.icon}</PixelIcon><div className="min-w-0 w-full"><div className="mb-3 flex flex-wrap items-center gap-2"><PixelBadge tone="blue" title={c.dungeonHint}>Project</PixelBadge><PixelBadge tone="gold" title={c.levelHint}>{c.projectLevel} {selected.level}</PixelBadge>{selected.archived && <PixelBadge tone="green" title={c.archiveHint}>{c.statusArchived}</PixelBadge>}{selected.paused && !selected.archived && <PixelBadge tone="neutral" title={c.sealedBadgeHint}>paused</PixelBadge>}{selected.stuck && <PixelBadge tone="red"><CircleAlert className="h-3 w-3" /> {c.rescue}</PixelBadge>}</div>{editingProjectId === selected.id ? <input value={draftTitle} onChange={(event) => setDraftTitle(event.target.value)} onBlur={commitRename} onKeyDown={(event) => { if (event.key === "Enter") commitRename(); if (event.key === "Escape") { setEditingProjectId(null); setDraftTitle(""); } }} autoFocus className="w-full max-w-sm rounded-xl bg-[#F5F5F7] px-3 py-2 text-[24px] font-medium leading-tight tracking-[-0.028em] outline-none ring-1 ring-black/[0.06] focus:bg-white focus:ring-4 focus:ring-black/10" /> : <div className="flex items-center gap-2"><h2 className="text-[24px] font-medium leading-tight tracking-[-0.028em]">{selected.title}</h2><button type="button" onClick={() => startRename(selected)} className="grid h-11 w-11 place-items-center rounded-full text-[#A1A1A6] transition hover:bg-[#F5F5F7] hover:text-[#1D1D1F] focus:outline-none focus:ring-4 focus:ring-black/10" aria-label="rename project"><Pencil className="h-4 w-4" /></button></div>}<input value={selected.subtitle || ""} onChange={(event) => updateProjectField(selected.id, "subtitle", event.target.value)} className="mt-1.5 block min-h-11 w-full rounded-[12px] border-0 bg-[#F5F5F7] px-3 text-[14px] font-normal text-[#86868B] outline-none transition focus:bg-white focus:ring-4 focus:ring-black/10" /></div><div className="flex gap-2"><Button onClick={toggleJailSelected} variant="light" disabled={selected.paused} className={selected.paused ? "opacity-50" : ""}><CircleAlert className="h-4 w-4" /> {selected.stuck ? c.closeJail : c.rescue}</Button><Button onClick={toggleSealSelected} variant="light" title={c.sealHint}><PauseCircle className="h-4 w-4" /> {selected.paused ? c.unseal : c.seal}</Button>{(progress === 100 || selected.archived) && <Button onClick={() => toggleArchiveProject(selected.id)} variant="light" title={c.archiveHint}><Archive className="h-4 w-4" /> {selected.archived ? c.unarchive : c.archive}</Button>}</div></div><div className="rounded-[18px] bg-gradient-to-br from-[#F7F8FB] via-[#F5F5F7] to-[#EAF4FF] p-6 ring-1 ring-black/[0.04]"><div className="grid gap-5 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-end"><div className="shrink-0"><div className="text-[13px] font-medium uppercase tracking-wide text-[#86868B]">Progress</div><div className="mt-1 text-[40px] font-medium tracking-[-0.05em]">{progress}%</div></div><div className="rounded-[14px] bg-white/70 p-3 ring-1 ring-black/[0.04]"><div className="mb-2 flex items-center justify-between text-[11px] font-medium uppercase tracking-wide text-[#A1A1A6]"><span>0</span><span>{progress}% cleared</span><span>100</span></div><div className="h-3 overflow-hidden rounded-full bg-[#E5E5EA]"><div className={cx("h-full rounded-full", tint.bar)} style={{ width: `${progress}%` }} /></div></div></div></div>{selected.paused && !selected.archived && <div className="mt-6 rounded-[16px] bg-[#F5F5F7] p-5 ring-1 ring-black/[0.04]"><div className="text-[15px] font-medium text-[#1D1D1F]">{c.sealedPanelTitle}</div><p className="mt-2 text-[14px] leading-6 text-[#86868B]">{c.sealedPanelDesc}</p></div>}</> : <EmptyState><div className="text-3xl">🗺️</div><h2 className="mt-3 text-[20px] font-medium tracking-[-0.02em]">{c.noProject}</h2><p className="mt-2">{c.noProjectDesc}</p></EmptyState>}</Card>{selected?.stuck && !selected.paused && <Card className="overflow-hidden bg-white p-0 ring-1 ring-[#FF453A]/10"><div className="border-b border-[#FF453A]/10 bg-[#FFF1EF] px-6 py-5"><div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div className="flex min-w-0 flex-1 gap-4"><PixelIcon className="bg-white text-[#D93025]"><CircleAlert className="h-7 w-7" /></PixelIcon><div className="min-w-0 flex-1"><div className="mb-2 flex flex-wrap items-center gap-2"><PixelBadge tone="red">{c.rescue}</PixelBadge><PixelBadge tone="neutral">{c.projectLevel} {selected.level}</PixelBadge></div><div className="text-[20px] font-medium tracking-[-0.02em] text-[#1D1D1F]">{c.rescueMode}</div><p className="mt-2 max-w-2xl text-[14px] leading-6 text-[#6E6E73]">{c.rescueDesc}</p></div></div><Button onClick={toggleJailSelected} variant="light" className="shrink-0">{c.closeJail}</Button></div></div><div className="grid gap-4 p-6 lg:grid-cols-2"><label className="block"><span className="mb-2 block text-[13px] font-medium text-[#1D1D1F]">{c.jailReasonTitle}</span><textarea value={selected.stuckReason || ""} onChange={(event) => updateProjectField(selected.id, "stuckReason", event.target.value)} placeholder={c.jailReasonPlaceholder} rows={4} className="w-full resize-none rounded-[16px] border-0 bg-[#F5F5F7] px-4 py-3 text-[14px] leading-6 text-[#3A3A3C] outline-none transition focus:bg-white focus:ring-4 focus:ring-[#FF453A]/10" /></label><label className="block"><span className="mb-2 block text-[13px] font-medium text-[#1D1D1F]">{c.jailPlanTitle}</span><textarea value={selected.stuckPlan || ""} onChange={(event) => updateProjectField(selected.id, "stuckPlan", event.target.value)} placeholder={c.jailPlanPlaceholder} rows={4} className="w-full resize-none rounded-[16px] border-0 bg-[#F5F5F7] px-4 py-3 text-[14px] leading-6 text-[#3A3A3C] outline-none transition focus:bg-white focus:ring-4 focus:ring-[#FF453A]/10" /></label></div><div className="mx-6 mb-6 rounded-[16px] bg-[#F5F5F7] px-4 py-3 text-[13px] leading-6 text-[#6E6E73]">{c.jailTip}</div></Card>}{renderBlockerHistory()}<Card className="p-7 sm:p-8"><div className="mb-7 flex items-end justify-between gap-4"><div><h3 className="text-[20px] font-medium tracking-[-0.025em]">{c.questLog}</h3><p className="mt-1.5 text-[13px] font-normal text-[#86868B]">{c.questLogDesc}</p></div><button type="button" onClick={() => setTaskModalOpen(true)} className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#1D1D1F] text-white shadow-sm transition hover:bg-black focus:outline-none focus:ring-4 focus:ring-black/10" aria-label="add task"><Plus className="h-5 w-5" /></button></div>{selected && orderedTasksOf(selected).length ? <div className="divide-y divide-black/[0.06]">{orderedTasksOf(selected).map((task) => { const isBoss = isMilestoneTask(task.type); const tone = task.done ? "green" : isBoss ? "red" : "blue"; const taskTypeOptions = TASK_TYPES.includes(task.type) ? TASK_TYPES : [task.type, ...TASK_TYPES]; return <div key={task.id} draggable onDragStart={() => selected && setDraggingTask({ projectId: selected.id, taskId: task.id })} onDragOver={(event) => event.preventDefault()} onDrop={() => { if (selected && draggingTask?.projectId === selected.id) reorderTaskInProject(selected.id, draggingTask.taskId, task.id); setDraggingTask(null); }} className="group flex w-full gap-3 py-5 text-left transition first:pt-0 last:pb-0"><div className="mt-1 grid h-8 w-5 shrink-0 cursor-grab place-items-center rounded-full text-[14px] text-[#C7C7CC] active:cursor-grabbing">⋮⋮</div><button type="button" onClick={() => completeTask(selected.id, task.id)} className={cx("mt-1 grid h-11 w-11 shrink-0 place-items-center rounded-full transition focus:outline-none focus:ring-4 focus:ring-black/10", task.done ? "bg-[#34C759] text-white" : "bg-[#F5F5F7] text-[#8E8E93] group-hover:bg-[#ECECEF]")}>{task.done ? <Check className="h-4 w-4" /> : <Circle className="h-4 w-4" />}</button><div className="min-w-0 flex-1"><div className="mb-2 flex flex-wrap items-center gap-2"><select value={task.type} onChange={(event) => selected && updateTaskMeta(selected.id, task.id, "type", event.target.value)} className="min-h-8 rounded-[9px] border-0 bg-[#F0F7FF] px-2 text-[11px] font-medium text-[#007AFF] outline-none ring-1 ring-[#007AFF]/10 focus:ring-4 focus:ring-[#007AFF]/15">{taskTypeOptions.map((type) => <option key={type} value={type}>{labelFor(lang, "taskType", type)}</option>)}</select><select value={task.weight} onChange={(event) => selected && updateTaskMeta(selected.id, task.id, "weight", event.target.value)} className="min-h-8 rounded-[9px] border-0 bg-[#FFF6D6] px-2 text-[11px] font-medium text-[#8A6400] outline-none ring-1 ring-[#FFD60A]/25 focus:ring-4 focus:ring-[#FFD60A]/20">{TASK_WEIGHTS.map((weight) => <option key={weight} value={weight}>+{weight}%</option>)}</select></div><div className={cx("text-[17px] font-medium tracking-[-0.01em]", task.done && "text-[#34A853] line-through")}>{task.title}</div><textarea data-autosize="true" value={task.action || ""} onChange={(event) => selected && handleTaskActionChange(selected.id, task.id, event)} rows={1} className="mt-2 min-h-11 w-full resize-none overflow-hidden rounded-[12px] border-0 bg-[#F5F5F7] px-3 py-2 text-[13px] leading-5 text-[#6E6E73] outline-none transition focus:bg-white focus:ring-4 focus:ring-black/10" placeholder={c.nodeDescPlaceholder} />{task.focusMode && <div className="mt-2 rounded-[14px] bg-[#FFF8E7] p-3 ring-1 ring-[#FFD60A]/25"><div className="mb-1 text-[12px] font-medium text-[#8A6400]">{c.fiveMinuteLabel}</div><textarea value={task.focusAction || ""} onChange={(event) => selected && updateTaskFocusAction(selected.id, task.id, event.target.value)} rows={2} className="w-full resize-none rounded-[10px] border-0 bg-white/60 px-3 py-2 text-[13px] leading-5 text-[#6E5B20] outline-none focus:ring-4 focus:ring-[#FFD60A]/20" /></div>}</div><button type="button" onClick={() => selected && deleteTask(selected.id, task.id)} className="mt-1 grid h-11 w-11 shrink-0 place-items-center rounded-full text-[#A1A1A6] transition hover:bg-[#F5F5F7] hover:text-[#D93025] focus:outline-none focus:ring-4 focus:ring-black/10"><Trash2 className="h-4 w-4" /></button></div>; })}</div> : <EmptyState>{c.noTasks}</EmptyState>}</Card></div><aside className="space-y-8">{renderProjectSwitcher()}</aside></section>{renderAddTaskModal()}{renderProjectManagerModal()}</main>
  );
}





