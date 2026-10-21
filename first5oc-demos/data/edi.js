/* Early Development Index (EDI) — ILLUSTRATIVE SAMPLE DATA
   ⚠ Every number in this file is INVENTED for a proposal demo. It does not
   represent real Orange County EDI results, real geographies, or real trends.
   Area names and the tile layout are placeholders; replace with the
   geographies First 5 OC actually reports (e.g. school districts, cities or
   neighborhoods) and real published figures before any production use.

   Values are "% of kindergartners vulnerable" per domain, per three-year wave.
   Lower is better. `anyOne` = vulnerable on one or more domains. */
window.F5_DATA = window.F5_DATA || {};
window.F5_DATA.edi = {
  illustrative: true,
  measure: '% of kindergartners vulnerable',
  waves: [
    { id: 'w1', label: 'Wave 1', years: 'Years 1–3 (illustrative)' },
    { id: 'w2', label: 'Wave 2', years: 'Years 4–6 (illustrative)' },
    { id: 'w3', label: 'Wave 3', years: 'Years 7–9 (illustrative)' }
  ],
  domains: [
    { id: 'anyOne', label: 'One or more areas', short: 'Any area', icon: '★', plain: 'Children who may need extra support in at least one of the five areas below.' },
    { id: 'physical', label: 'Physical Health & Well-being', short: 'Physical', icon: '🤸', plain: 'Gross and fine motor skills, energy levels and coming to school ready to learn (rested, fed).' },
    { id: 'social', label: 'Social Competence', short: 'Social', icon: '🤝', plain: 'Getting along with others, following rules and routines, curiosity about the world.' },
    { id: 'emotional', label: 'Emotional Maturity', short: 'Emotional', icon: '💛', plain: 'Helping others, managing feelings, focusing attention.' },
    { id: 'language', label: 'Language & Cognitive Development', short: 'Language', icon: '🔤', plain: 'Interest in books, early reading and writing, early math.' },
    { id: 'communication', label: 'Communication Skills & General Knowledge', short: 'Communication', icon: '💬', plain: 'Telling a story, expressing needs, general knowledge about the world.' }
  ],
  regions: [
    { id: 'north', label: 'North County (placeholder)' },
    { id: 'west', label: 'West County (placeholder)' },
    { id: 'central', label: 'Central County (placeholder)' },
    { id: 'south', label: 'South County (placeholder)' }
  ],
  // col/row place each area on a simple tile map (not to scale).
  areas: 
[
    {"id": "n-a", "name": "North Area A", "region": "north", "col": 0, "row": 0, "values": {"w1": {"physical": 8.6, "social": 9.1, "emotional": 10.2, "language": 7.5, "communication": 11.5, "anyOne": 19.5, "assessed": 604}, "w2": {"physical": 7.2, "social": 7.2, "emotional": 10.8, "language": 6.4, "communication": 8.8, "anyOne": 20.2, "assessed": 654}, "w3": {"physical": 10.0, "social": 11.1, "emotional": 8.8, "language": 11.1, "communication": 10.5, "anyOne": 19.2, "assessed": 573}}},
    {"id": "n-b", "name": "North Area B", "region": "north", "col": 1, "row": 0, "values": {"w1": {"physical": 10.7, "social": 9.5, "emotional": 10.1, "language": 9.6, "communication": 9.4, "anyOne": 18.3, "assessed": 1470}, "w2": {"physical": 10.3, "social": 8.3, "emotional": 11.3, "language": 9.5, "communication": 10.8, "anyOne": 21.5, "assessed": 1591}, "w3": {"physical": 8.8, "social": 7.1, "emotional": 10.5, "language": 8.5, "communication": 8.6, "anyOne": 20.7, "assessed": 1448}}},
    {"id": "n-c", "name": "North Area C", "region": "north", "col": 2, "row": 0, "values": {"w1": {"physical": 11.0, "social": 7.5, "emotional": 12.0, "language": 11.2, "communication": 12.3, "anyOne": 23.3, "assessed": 1416}, "w2": {"physical": 11.8, "social": 10.2, "emotional": 11.5, "language": 11.9, "communication": 14.3, "anyOne": 25.3, "assessed": 1498}, "w3": {"physical": 9.0, "social": 7.3, "emotional": 10.6, "language": 8.6, "communication": 8.2, "anyOne": 19.1, "assessed": 1499}}},
    {"id": "n-d", "name": "North Area D", "region": "north", "col": 3, "row": 1, "values": {"w1": {"physical": 7.0, "social": 5.2, "emotional": 10.1, "language": 6.0, "communication": 8.5, "anyOne": 18.3, "assessed": 1108}, "w2": {"physical": 7.0, "social": 6.0, "emotional": 9.2, "language": 7.7, "communication": 9.9, "anyOne": 17.7, "assessed": 1032}, "w3": {"physical": 9.1, "social": 8.0, "emotional": 6.2, "language": 5.0, "communication": 7.3, "anyOne": 16.3, "assessed": 1043}}},
    {"id": "w-a", "name": "West Area A", "region": "west", "col": 0, "row": 1, "values": {"w1": {"physical": 13.7, "social": 12.0, "emotional": 14.6, "language": 15.0, "communication": 15.9, "anyOne": 28.0, "assessed": 782}, "w2": {"physical": 12.4, "social": 14.6, "emotional": 15.9, "language": 15.0, "communication": 16.6, "anyOne": 28.7, "assessed": 755}, "w3": {"physical": 12.0, "social": 8.0, "emotional": 9.8, "language": 9.1, "communication": 10.9, "anyOne": 21.2, "assessed": 712}}},
    {"id": "w-b", "name": "West Area B", "region": "west", "col": 0, "row": 2, "values": {"w1": {"physical": 9.9, "social": 6.9, "emotional": 12.4, "language": 10.0, "communication": 10.0, "anyOne": 21.6, "assessed": 596}, "w2": {"physical": 8.3, "social": 10.0, "emotional": 12.4, "language": 8.8, "communication": 10.8, "anyOne": 21.1, "assessed": 572}, "w3": {"physical": 8.2, "social": 9.2, "emotional": 8.0, "language": 6.1, "communication": 12.2, "anyOne": 22.1, "assessed": 577}}},
    {"id": "w-c", "name": "West Area C", "region": "west", "col": 1, "row": 3, "values": {"w1": {"physical": 15.9, "social": 13.9, "emotional": 14.9, "language": 11.7, "communication": 14.2, "anyOne": 26.9, "assessed": 456}, "w2": {"physical": 14.9, "social": 11.4, "emotional": 12.7, "language": 14.0, "communication": 16.8, "anyOne": 30.4, "assessed": 459}, "w3": {"physical": 16.2, "social": 12.4, "emotional": 15.5, "language": 13.5, "communication": 14.1, "anyOne": 27.0, "assessed": 422}}},
    {"id": "c-a", "name": "Central Area A", "region": "central", "col": 1, "row": 1, "values": {"w1": {"physical": 14.8, "social": 15.5, "emotional": 17.5, "language": 16.1, "communication": 15.5, "anyOne": 29.7, "assessed": 1309}, "w2": {"physical": 12.7, "social": 13.1, "emotional": 16.1, "language": 14.5, "communication": 14.9, "anyOne": 28.7, "assessed": 1435}, "w3": {"physical": 13.0, "social": 12.6, "emotional": 13.9, "language": 12.4, "communication": 13.2, "anyOne": 23.8, "assessed": 1432}}},
    {"id": "c-b", "name": "Central Area B", "region": "central", "col": 2, "row": 1, "values": {"w1": {"physical": 15.0, "social": 13.6, "emotional": 17.8, "language": 15.5, "communication": 15.0, "anyOne": 29.9, "assessed": 1436}, "w2": {"physical": 17.8, "social": 13.4, "emotional": 18.2, "language": 17.5, "communication": 18.1, "anyOne": 31.2, "assessed": 1532}, "w3": {"physical": 10.9, "social": 13.6, "emotional": 14.0, "language": 12.1, "communication": 15.9, "anyOne": 27.7, "assessed": 1611}}},
    {"id": "c-c", "name": "Central Area C", "region": "central", "col": 1, "row": 2, "values": {"w1": {"physical": 17.5, "social": 15.8, "emotional": 19.1, "language": 16.4, "communication": 19.1, "anyOne": 32.0, "assessed": 741}, "w2": {"physical": 17.7, "social": 16.7, "emotional": 19.9, "language": 16.5, "communication": 20.7, "anyOne": 35.6, "assessed": 699}, "w3": {"physical": 16.1, "social": 16.4, "emotional": 17.1, "language": 15.0, "communication": 20.5, "anyOne": 34.3, "assessed": 692}}},
    {"id": "c-d", "name": "Central Area D", "region": "central", "col": 2, "row": 2, "values": {"w1": {"physical": 17.9, "social": 16.6, "emotional": 19.4, "language": 15.1, "communication": 19.1, "anyOne": 32.8, "assessed": 1136}, "w2": {"physical": 18.4, "social": 17.2, "emotional": 19.9, "language": 19.2, "communication": 19.2, "anyOne": 34.7, "assessed": 1180}, "w3": {"physical": 18.4, "social": 15.8, "emotional": 18.0, "language": 16.4, "communication": 20.5, "anyOne": 35.9, "assessed": 1250}}},
    {"id": "s-a", "name": "South Area A", "region": "south", "col": 3, "row": 2, "values": {"w1": {"physical": 12.1, "social": 10.1, "emotional": 8.9, "language": 7.5, "communication": 10.9, "anyOne": 20.6, "assessed": 731}, "w2": {"physical": 9.5, "social": 8.5, "emotional": 10.8, "language": 6.2, "communication": 10.7, "anyOne": 20.3, "assessed": 719}, "w3": {"physical": 14.0, "social": 9.2, "emotional": 14.2, "language": 10.4, "communication": 12.8, "anyOne": 26.7, "assessed": 804}}},
    {"id": "s-b", "name": "South Area B", "region": "south", "col": 2, "row": 3, "values": {"w1": {"physical": 4.8, "social": 2.6, "emotional": 5.0, "language": 5.4, "communication": 4.4, "anyOne": 11.3, "assessed": 994}, "w2": {"physical": 3.2, "social": 3.0, "emotional": 4.3, "language": 2, "communication": 7.1, "anyOne": 14.7, "assessed": 1079}, "w3": {"physical": 2, "social": 2, "emotional": 4.4, "language": 2, "communication": 2.2, "anyOne": 9.3, "assessed": 1070}}},
    {"id": "s-c", "name": "South Area C", "region": "south", "col": 3, "row": 3, "values": {"w1": {"physical": 11.3, "social": 8.2, "emotional": 10.6, "language": 6.6, "communication": 8.5, "anyOne": 21.1, "assessed": 752}, "w2": {"physical": 9.9, "social": 7.1, "emotional": 9.6, "language": 5.2, "communication": 10.6, "anyOne": 18.2, "assessed": 806}, "w3": {"physical": 8.0, "social": 7.5, "emotional": 10.9, "language": 6.7, "communication": 8.1, "anyOne": 20.0, "assessed": 730}}},
    {"id": "s-d", "name": "South Area D", "region": "south", "col": 4, "row": 3, "values": {"w1": {"physical": 3.8, "social": 2.8, "emotional": 4.6, "language": 5.3, "communication": 5.2, "anyOne": 11.0, "assessed": 593}, "w2": {"physical": 2.4, "social": 2, "emotional": 2.7, "language": 4.6, "communication": 5.8, "anyOne": 10.8, "assessed": 623}, "w3": {"physical": 5.5, "social": 7.1, "emotional": 7.2, "language": 6.2, "communication": 9.7, "anyOne": 17.7, "assessed": 626}}},
    {"id": "s-e", "name": "South Area E", "region": "south", "col": 4, "row": 4, "values": {"w1": {"physical": 10.1, "social": 8.0, "emotional": 9.5, "language": 7.2, "communication": 9.0, "anyOne": 17.3, "assessed": 1670}, "w2": {"physical": 8.3, "social": 4.6, "emotional": 6.0, "language": 4.4, "communication": 9.7, "anyOne": 19.1, "assessed": 1823}, "w3": {"physical": 5.9, "social": 4.6, "emotional": 7.1, "language": 4.5, "communication": 7.8, "anyOne": 14.3, "assessed": 1906}}},
    {"id": "s-f", "name": "South Area F", "region": "south", "col": 5, "row": 4, "values": {"w1": {"physical": 12.4, "social": 8.0, "emotional": 10.0, "language": 7.1, "communication": 10.8, "anyOne": 22.3, "assessed": 1166}, "w2": {"physical": 9.3, "social": 5.6, "emotional": 8.6, "language": 6.5, "communication": 9.9, "anyOne": 17.0, "assessed": 1076}, "w3": {"physical": 7.7, "social": 7.7, "emotional": 9.3, "language": 8.9, "communication": 10.5, "anyOne": 19.9, "assessed": 1236}}}]

};
