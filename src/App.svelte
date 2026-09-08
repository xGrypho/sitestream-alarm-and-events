<script lang="ts">
  import Info from './lib/Info.svelte';
  import QueueSection from './lib/QueueSection.svelte';
  type Priority = 'Critical' | 'High' | 'Medium' | 'Low';
  type IncidentStatus = 'Unreviewed' | 'In Progress' | 'Resolved';

  type Incident = {
    id: number;
    title: string;
    type: 'intrusion' | 'camera' | 'fuel' | 'battery';
    site: string;
    trailer: string;
    priority: Priority;
    time: string;
    status: IncidentStatus;
    detail: string;
  };

  const priorityStyles: Record<Priority, string> = {
    Critical: 'border-red-300 bg-red-50 text-red-600',
    High: 'border-orange-200 bg-orange-50 text-orange-600',
    Medium: 'border-amber-200 bg-amber-50 text-amber-600',
    Low: 'border-slate-200 bg-slate-50 text-slate-600',
  };

  const iconByType: Record<Incident['type'], string> = {
    intrusion: '!',
    camera: '⌁',
    fuel: '⛽',
    battery: '▭',
  };

  let incidents: Incident[] = [
    { id: 1, title: 'Intrusion detected', type: 'intrusion', site: 'Upper Heights', trailer: '0026T', priority: 'Critical', time: '1 min ago', status: 'Unreviewed', detail: 'Motion detected in restricted area' },
    { id: 2, title: 'Camera offline', type: 'camera', site: 'Copper Ridge', trailer: '0014T', priority: 'High', time: '5 min ago', status: 'Unreviewed', detail: 'Camera 2 stopped reporting' },
    { id: 3, title: 'Low fuel level', type: 'fuel', site: 'Riverside Build', trailer: '0032T', priority: 'Medium', time: '12 min ago', status: 'Unreviewed', detail: 'Fuel level has reached 18%' },
    { id: 4, title: 'Battery maintenance', type: 'battery', site: 'Northpoint', trailer: '0018T', priority: 'Low', time: '25 min ago', status: 'Unreviewed', detail: 'Battery health check is due' },
    { id: 5, title: 'Camera offline', type: 'camera', site: 'Summit View', trailer: '0041T', priority: 'High', time: '32 min ago', status: 'Unreviewed', detail: 'Camera 1 connection interrupted' },
    { id: 6, title: 'Intrusion detected', type: 'intrusion', site: 'Oakwood Phase 2', trailer: '0021T', priority: 'High', time: '8 min ago', status: 'In Progress', detail: 'Perimeter activity detected' },
    { id: 7, title: 'Low fuel level', type: 'fuel', site: 'Lakeside', trailer: '0035T', priority: 'Medium', time: '15 min ago', status: 'In Progress', detail: 'Fuel level has reached 31%' },
    { id: 8, title: 'Battery maintenance', type: 'battery', site: 'Eastfield', trailer: '0011T', priority: 'Low', time: '1 hr ago', status: 'In Progress', detail: 'Battery health check is due' },
    { id: 9, title: 'Camera offline', type: 'camera', site: 'Upper Heights', trailer: '0026T', priority: 'High', time: '18 min ago', status: 'In Progress', detail: 'Camera 3 connection is being investigated' },
    { id: 10, title: 'Low fuel level', type: 'fuel', site: 'Oakwood Phase 2', trailer: '0021T', priority: 'Medium', time: '4 min ago', status: 'Unreviewed', detail: 'Fuel level has reached 24%' },
  ];

  let selectedId = 1;
  let activeTab = 'Alarms & Events';
  let notice = '';
  let liveMode = false;
  let showSiteFilter = false;
  let selectedTrailers = [...new Set(incidents.map((incident) => incident.trailer))];
  let noteText = '';
  let eventLogs: Record<number, Array<{ time: string; text: string }>> = {
    1: [
      { time: '10:24 AM', text: 'Event received from Camera 1' },
      { time: '10:27 AM', text: 'Assigned to Operations Lead' },
    ],
    6: [{ time: '10:16 AM', text: 'Event acknowledged' }],
  };

  $: selected = incidents.find((incident) => incident.id === selectedId) ?? incidents[0];
  $: activityLog = selected ? eventLogs[selected.id] ?? [] : [];
  $: filterOptions = [...new Map(incidents.map((incident) => [incident.trailer, { trailer: incident.trailer, site: incident.site }])).values()].sort((a, b) => a.trailer.localeCompare(b.trailer, undefined, { numeric: true }));
  $: filteredIncidents = incidents.filter((incident) => selectedTrailers.includes(incident.trailer));
  $: unreviewed = filteredIncidents.filter((incident) => incident.status === 'Unreviewed');
  $: inProgress = filteredIncidents.filter((incident) => incident.status === 'In Progress');
  $: resolved = filteredIncidents.filter((incident) => incident.status === 'Resolved');
  $: activeIncidents = filteredIncidents.filter((incident) => incident.status !== 'Resolved');

  function setVisibleTrailers(trailers: string[]) {
    selectedTrailers = trailers;
    const nextIncident = incidents.find((incident) => trailers.includes(incident.trailer));
    selectedId = nextIncident?.id ?? 0;
  }

  function toggleTrailer(trailer: string) {
    setVisibleTrailers(selectedTrailers.includes(trailer) ? selectedTrailers.filter((item) => item !== trailer) : [...selectedTrailers, trailer]);
  }

  function action(message: string, logMessage = message) {
    if (selected) {
      const time = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' }).format(new Date());
      eventLogs = { ...eventLogs, [selected.id]: [...(eventLogs[selected.id] ?? []), { time, text: logMessage }] };
    }
    notice = message;
    window.setTimeout(() => (notice = ''), 2800);
  }

  function acknowledge() {
    incidents = incidents.map((incident) => incident.id === selected.id ? { ...incident, status: 'In Progress' } : incident);
    action('Event acknowledged and moved to In Progress.', 'Event acknowledged');
  }

  function resolve() {
    action('Event resolved and moved to history.', 'Event resolved');
    incidents = incidents.map((incident) => incident.id === selected.id ? { ...incident, status: 'Resolved' } : incident);
  }

  function saveNote() {
    const note = noteText.trim();
    if (!note) return;
    action('Note added to this event.', `Note added: “${note}”`);
    noteText = '';
  }

  const health = [
    ['Battery', '87%', 'Good', 'green'],
    ['Fuel Level', '62%', 'Good', 'blue'],
    ['Network', 'Strong', 'LTE', 'green'],
    ['Cameras', '3 / 4', '1 offline', 'blue'],
    ['Temperature', '72°F', 'Normal', 'green'],
  ];

  const criticalEvents = [
    { title: 'Intrusion detected', location: 'Upper Heights · 0026T', time: '1 min ago', status: 'Unreviewed' },
    { title: 'Perimeter breach', location: 'Oakwood Phase 2 · 0021T', time: '8 min ago', status: 'In Progress' },
    { title: 'Intrusion detected', location: 'Northpoint · 0018T', time: '26 min ago', status: 'Unreviewed' },
    { title: 'Tamper detected', location: 'Copper Ridge · 0014T', time: '41 min ago', status: 'In Progress' },
  ];
</script>

<svelte:head>
  <meta name="description" content="Alert and Event Dispatch Center prototype" />
</svelte:head>

<div class="min-h-screen bg-slate-50 text-ink">
  <header class="border-b border-slate-200 bg-white px-4 pt-4">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-xl text-primary">▣</div>
        <div>
          <h1 class="text-xl font-bold tracking-tight">Alert & Event Dispatch Center</h1>
          <p class="text-sm text-slate-500">Mobile Surveillance Trailers</p>
        </div>
      </div>
      <div class="flex items-center gap-5">
        <label class="flex w-80 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-400">
          <span>⌕</span><input aria-label="Search alerts" class="w-full bg-transparent outline-none" placeholder="Search sites, trailers, or events..." />
        </label>
        <button class="relative text-xl text-slate-600" aria-label="Notifications">♟<span class="absolute -right-2 -top-2 rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white">11</span></button>
        <button class="flex items-center gap-2 text-sm font-semibold text-slate-700">Operations Lead <span class="text-xs">⌄</span></button>
      </div>
    </div>
    <nav class="mt-4 flex gap-7" aria-label="Main navigation">
      {#each ['Overview', 'Alarms & Events'] as tab}
        <button on:click={() => (activeTab = tab)} class:active-tab={activeTab === tab} class="border-b-2 border-transparent px-1 pb-3 text-sm font-semibold text-slate-500 transition hover:text-primary">{tab}</button>
      {/each}
    </nav>
  </header>

  <main class="grid min-h-[calc(100vh-109px)] grid-cols-[28%_minmax(600px,1fr)_23%] gap-4 p-3.5">
    <aside class="relative rounded-xl border border-slate-200 bg-white shadow-panel">
      <div class="flex items-center justify-between border-b border-slate-200 px-5 py-4"><h2 class="font-bold">Incident Queue</h2><span class="text-slate-400">⇅</span></div>
      <div class="absolute right-16 top-3 z-20"><button on:click={() => (showSiteFilter = !showSiteFilter)} aria-expanded={showSiteFilter} aria-controls="site-filter-menu" aria-label="Filter by sites" class="grid h-8 w-8 place-items-center rounded-md text-slate-500 transition hover:bg-blue-50 hover:text-primary focus:outline-none focus:ring-2 focus:ring-blue-100"><svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M4 6h16M7 12h10M10 18h4" /></svg></button>{#if showSiteFilter}<div id="site-filter-menu" class="absolute right-0 top-10 w-60 rounded-xl border border-slate-200 bg-white p-3 shadow-xl"><div class="flex items-center justify-between border-b border-slate-100 pb-2"><p class="text-xs font-bold uppercase tracking-wide text-slate-600">Filter units</p><button on:click={() => setVisibleTrailers(filterOptions.map((option) => option.trailer))} class="text-xs font-semibold text-primary">Select all</button></div><div class="max-h-64 space-y-1 overflow-y-auto py-2">{#each filterOptions as option}<label class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm text-slate-700 hover:bg-slate-50"><input type="checkbox" checked={selectedTrailers.includes(option.trailer)} on:change={() => toggleTrailer(option.trailer)} class="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary" /><span class="font-semibold text-slate-800">{option.trailer}</span><span class="truncate text-slate-500">· {option.site}</span></label>{/each}</div><div class="border-t border-slate-100 pt-2 text-xs text-slate-500">{selectedTrailers.length} of {filterOptions.length} units selected</div></div>{/if}</div>
      <QueueSection label="Unreviewed" count={unreviewed.length} incidents={unreviewed} {selectedId} onSelect={(id) => (selectedId = id)} />
      <QueueSection label="In Progress" count={inProgress.length} incidents={inProgress} {selectedId} onSelect={(id) => (selectedId = id)} />
      <QueueSection label="Resolved" count={resolved.length} incidents={resolved} {selectedId} onSelect={(id) => (selectedId = id)} />
      <div class="border-t border-slate-100 px-5 py-4 text-xs text-slate-500">Showing {activeIncidents.length} active events{resolved.length ? ` · ${resolved.length} resolved` : ''}</div>
    </aside>

    <section class="rounded-xl border border-slate-200 bg-white shadow-panel">
      <div class="border-b border-slate-200 px-6 py-5">
        <div class="flex items-start justify-between"><div><p class="text-xs font-bold uppercase tracking-wide text-primary">Event details</p><div class="mt-3 flex items-center gap-3"><div class="grid h-11 w-11 place-items-center rounded-xl bg-red-500 text-2xl font-bold text-white">!</div><div><h2 class="text-2xl font-bold">{selected.title}</h2><p class="mt-1 text-sm text-slate-500">{selected.detail}</p></div></div></div><div class="flex gap-2"><span class="rounded-md bg-red-50 px-3 py-1.5 text-sm font-bold text-red-600">{selected.priority}</span><span class="rounded-md bg-blue-50 px-3 py-1.5 text-sm font-bold text-primary">{selected.status}</span></div></div>
        <div class="mt-6 grid grid-cols-3 gap-4 border-t border-slate-100 pt-5 text-sm"><Info label="Customer" value="Ridgeline Builders" icon="♙" /><Info label="Site" value={selected.site} icon="⌂" /><Info label="Trailer" value={selected.trailer} icon="▣" /></div>
        <div class="mt-4 grid grid-cols-2 gap-4 border-t border-slate-100 pt-4 text-sm"><Info label="Event time" value="May 14, 2025 10:24:17 AM" icon="◷" /><Info label="Elapsed time" value={selected.time} icon="◴" /></div>
      </div>

      <div class="p-6">
        <p class="text-xs font-bold uppercase tracking-wide text-primary">Evidence</p>
        <div class="mt-2 grid grid-cols-2 gap-4">
          <article><p class="mb-2 text-sm font-semibold text-slate-600">Camera 1 · North View</p><div class:live-glow={liveMode} class="relative h-52 overflow-hidden rounded-xl bg-[radial-gradient(circle_at_70%_25%,#e0a750,transparent_12%),linear-gradient(135deg,#243b2a_0%,#745838_40%,#d6c29e_40%,#a87f43_100%)]"><div class="absolute inset-x-0 top-0 flex justify-between bg-slate-950/70 px-3 py-2 text-xs font-semibold text-white"><span>{liveMode ? 'LIVE' : 'PLAYBACK'} · 05-14-2025 10:24:17 AM</span><span class="rounded bg-red-500 px-1.5">●</span></div><div class="absolute bottom-5 left-8 h-16 w-32 rounded border-4 border-amber-950 bg-amber-700/70"></div><div class="absolute bottom-6 right-12 h-24 w-3 rounded bg-slate-800 shadow-[18px_-35px_0_2px_#e6e3db]"></div></div></article>
          <article><p class="mb-2 text-sm font-semibold text-slate-600">Map location</p><div class="relative h-52 overflow-hidden rounded-xl bg-[linear-gradient(25deg,#d9ecdf_0_18%,#f6f0e6_18%_35%,#d7e8f8_35%_43%,#f6f0e6_43%_58%,#d9ecdf_58%)]"><div class="absolute inset-0 opacity-50 [background-image:linear-gradient(#b8c7d8_1px,transparent_1px),linear-gradient(90deg,#b8c7d8_1px,transparent_1px)] [background-size:36px_36px]"></div><div class="absolute left-[43%] top-[38%] grid h-14 w-14 place-items-center rounded-full border-4 border-primary bg-white text-xl text-primary shadow-lg">▣</div><div class="absolute left-[55%] top-[48%] text-sm font-bold text-primary">{selected.trailer}</div><div class="absolute bottom-3 right-3 grid h-9 w-9 place-items-center rounded-lg bg-white text-lg shadow">⌖</div></div></article>
        </div>

        <p class="mt-5 text-xs font-bold uppercase tracking-wide text-primary">Equipment health</p>
        <div class="mt-3 grid grid-cols-5 gap-3">{#each health as metric}<div class="rounded-xl border border-slate-100 bg-slate-50 p-3"><p class="text-xs font-semibold text-slate-500">{metric[0]}</p><p class:green={metric[3] === 'green'} class:blue={metric[3] === 'blue'} class="mt-1 text-lg font-bold">{metric[1]}</p><p class="text-xs text-slate-500">{metric[2]}</p></div>{/each}</div>
      </div>

      <div class="flex gap-3 border-t border-slate-200 p-5"><button on:click={acknowledge} class="action primary">✓ Acknowledge</button><button on:click={() => { liveMode = !liveMode; action(liveMode ? 'Live camera opened.' : 'Playback selected.'); }} class="action">▷ {liveMode ? 'Viewing Live' : 'View Live'}</button><button on:click={() => action('Event sent to the configured mobile device.')} class="action">▯ Send to Mobile</button><button on:click={() => action('Email alert sent to configured recipients.')} class="action">✉ Email Alert</button><button on:click={resolve} class="action danger">◎ Resolve</button></div>
      <section class="border-t border-slate-200 bg-blue-50/60 px-5 py-4">
        <div class="flex items-center justify-between"><p class="text-xs font-bold uppercase tracking-wide text-primary">Event activity</p><span class="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-primary">{activityLog.length} actions</span></div>
        {#if activityLog.length}
          <ol class="mt-3 space-y-2 border-l-2 border-blue-200 pl-4">
            {#each activityLog as log}
              <li class="relative flex items-start gap-3 text-sm"><span class="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-primary"></span><time class="w-16 shrink-0 font-semibold text-primary">{log.time}</time><span class="text-slate-700">{log.text}</span></li>
            {/each}
          </ol>
        {:else}
          <p class="mt-2 text-sm text-slate-500">No actions have been recorded for this event.</p>
        {/if}
      </section>
    </section>

    <aside class="space-y-4"><section class="rounded-xl border border-slate-200 bg-white p-5 shadow-panel"><div class="flex items-center justify-between"><h2 class="font-bold">Last Critical Events</h2><span class="rounded-full bg-red-50 px-2 py-1 text-xs font-bold text-red-600">{criticalEvents.length}</span></div><div class="mt-5 space-y-4 border-l-2 border-red-100 pl-5">{#each criticalEvents as event}<div class="relative"><span class="absolute -left-[27px] top-1 h-3 w-3 rounded-full border-2 border-white bg-red-500"></span><div class="flex items-start justify-between gap-2"><div><p class="text-sm font-semibold">{event.title}</p><p class="mt-1 text-xs text-slate-500">{event.location}</p><p class="mt-1 text-xs text-slate-500">{event.time}</p></div><span class="rounded-md px-2 py-1 text-xs font-bold {event.status === 'Unreviewed' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-primary'}">{event.status}</span></div></div>{/each}</div></section><section class="rounded-xl border border-slate-200 bg-white p-5 shadow-panel"><h2 class="font-bold">Event Notes</h2><textarea bind:value={noteText} class="mt-4 h-28 w-full resize-none rounded-lg border border-slate-200 p-3 text-sm outline-none focus:border-primary" placeholder="Add a note..."></textarea><button on:click={saveNote} class="mt-3 w-full rounded-lg bg-blue-50 py-2 text-sm font-semibold text-primary">Add Note</button></section></aside>
  </main>

  {#if notice}<div class="fixed bottom-6 left-1/2 -translate-x-1/2 rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-white shadow-xl">{notice}</div>{/if}
</div>

<style>
  :global(.active-tab) { border-color: #087fe8; color: #087fe8; }
  :global(.selected-card) { border-color: #ef4444; background: #fffafa; box-shadow: 0 5px 18px rgba(239, 68, 68, 0.09); }
  :global(.action) { flex: 1; border: 1px solid #93c5fd; border-radius: 0.5rem; background: #fff; padding: 0.625rem 0.75rem; color: #087fe8; font-size: 0.875rem; font-weight: 600; transition: background 150ms ease; }
  :global(.action:hover) { background: #eff6ff; }
  :global(.action.primary) { border-color: #087fe8; background: #087fe8; color: #fff; }
  :global(.action.primary:hover) { background: #0571cd; }
  :global(.action.danger) { border-color: #fca5a5; color: #ef4444; }
  :global(.action.danger:hover) { background: #fef2f2; }
  :global(.green) { color: #169b52; }
  :global(.blue) { color: #087fe8; }
  :global(.dot-red) { background: #ef4444; }
  :global(.dot-orange) { background: #f97316; }
  :global(.dot-amber) { background: #f59e0b; }
  :global(.dot-blue) { background: #087fe8; }
  :global(.live-glow) { box-shadow: inset 0 0 0 3px #ef4444; }
</style>
