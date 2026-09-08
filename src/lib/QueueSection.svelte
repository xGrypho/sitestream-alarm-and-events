<script lang="ts">
  export let label: 'Unreviewed' | 'In Progress' | 'Resolved';
  export let count: number;
  export let selectedId: number;
  export let onSelect: (id: number) => void;
  export let incidents: Array<{ id: number; title: string; type: 'intrusion' | 'camera' | 'fuel' | 'battery'; site: string; trailer: string; priority: 'Critical' | 'High' | 'Medium' | 'Low'; time: string }>;
  const priorityStyles = { Critical: 'bg-red-50 text-red-600', High: 'bg-orange-50 text-orange-500', Medium: 'bg-amber-50 text-amber-500', Low: 'bg-blue-50 text-primary' };
  const priorityTextStyles = { Critical: 'text-red-600', High: 'text-orange-500', Medium: 'text-amber-500', Low: 'text-primary' };
  const iconByType = { intrusion: '!', camera: '⌁', fuel: '▣', battery: '▭' };
</script>

<section class="border-b border-slate-100 px-3 py-3">
    <div class="mb-3 flex items-center justify-between px-2"><h3 class="text-sm font-bold text-[#102a4c]">{label === 'Resolved' ? 'Resolved history' : label}</h3><span class="grid h-5 min-w-5 place-items-center rounded-full {label === 'Unreviewed' ? 'bg-red-500' : label === 'Resolved' ? 'bg-emerald-500' : 'bg-primary'} px-1 text-xs font-bold text-white">{count}</span></div>
  <div class="space-y-2">
    {#each incidents as incident}
      <button on:click={() => onSelect(incident.id)} class:selected-card={selectedId === incident.id} class="relative w-full rounded-lg border border-slate-100 bg-white p-3 text-left transition hover:border-blue-200">
        <div class="flex items-start gap-3">
          <span class="grid h-9 w-9 place-items-center rounded-full {priorityStyles[incident.priority]} text-xl font-bold">{iconByType[incident.type]}</span>
          <div class="min-w-0 flex-1"><p class="truncate text-xs text-slate-500"><span class="mr-2 inline-block h-2 w-2 rounded-full {incident.priority === 'Critical' ? 'bg-red-500' : incident.priority === 'High' ? 'bg-orange-500' : incident.priority === 'Medium' ? 'bg-amber-500' : 'bg-slate-400'}"></span>{incident.site} · {incident.trailer}</p><p class="mt-1 text-sm font-bold text-slate-800">{incident.title}</p></div>
          <div class="text-right"><p class="text-xs font-bold {priorityTextStyles[incident.priority]}">{incident.priority}</p><p class="mt-1 text-xs text-slate-500">{incident.time}</p></div>
        </div>
      </button>
    {:else}
      <p class="rounded-lg bg-slate-50 px-3 py-3 text-xs text-slate-500">{label === 'Resolved' ? 'No resolved events yet.' : 'No events in this queue.'}</p>
    {/each}
  </div>
</section>
