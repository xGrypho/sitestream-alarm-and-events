<script lang="ts">
  export let label: string;
  export let value: string;
  export let icon: string;
</script>

<div class="flex items-center gap-3">
  <span class="grid h-8 w-8 place-items-center text-2xl font-light text-primary">{icon}</span>
  <div><p class="text-[10px] font-bold uppercase tracking-wide text-slate-500">{label}</p><p class="font-semibold text-slate-800">{value}</p></div>
</div>
