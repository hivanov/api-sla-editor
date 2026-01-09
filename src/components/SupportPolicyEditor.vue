<template>
  <div class="card mt-3 support-policy-editor-component">
    <div class="card-header">
      Support Policy
    </div>
    <div class="card-body">
      <!-- Contact Points -->
      <h6>Contact Points</h6>
      <div v-for="(cp, index) in safeSupportPolicy.contactPoints" :key="index" class="card mb-2 p-2">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <span>Contact Point #{{ index + 1 }}</span>
          <button class="btn btn-danger btn-sm" @click="removeContactPoint(index)">Remove</button>
        </div>
        <div class="mb-3">
          <label class="form-label">Contact Type</label>
          <input type="text" class="form-control" :class="{'is-invalid': errors[path + '/contactPoints/' + index + '/contactType']}" placeholder="e.g., Technical Support" :value="cp.contactType" @input="updateContactPoint(index, 'contactType', $event.target.value)">
          <div class="invalid-feedback" v-if="errors[path + '/contactPoints/' + index + '/contactType']">
            {{ errors[path + '/contactPoints/' + index + '/contactType'].join(', ') }}
          </div>
        </div>
        <h6>Channels</h6>
        <div v-for="(channel, cIndex) in cp.channels" :key="cIndex" class="card mb-2 p-2 channel-item">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <span>Channel #{{ cIndex + 1 }}</span>
            <button class="btn btn-danger btn-sm" @click="removeChannel(index, cIndex)">Remove</button>
          </div>
          <div v-if="errors[path + '/contactPoints/' + index + '/channels/' + cIndex]" class="alert alert-danger py-1 small mb-2">
            {{ errors[path + '/contactPoints/' + index + '/channels/' + cIndex].join(', ') }}
          </div>
          <div class="mb-3">
            <label class="form-label">Type</label>
            <select class="form-select" :class="{'is-invalid': errors[path + '/contactPoints/' + index + '/channels/' + cIndex + '/type']}" :value="channel.type" @change="updateChannel(index, cIndex, 'type', $event.target.value)">
              <option value="web">Web</option>
              <option value="email">Email</option>
              <option value="phone">Phone</option>
              <option value="chat">Chat</option>
            </select>
            <div class="invalid-feedback" v-if="errors[path + '/contactPoints/' + index + '/channels/' + cIndex + '/type']">
              {{ errors[path + '/contactPoints/' + index + '/channels/' + cIndex + '/type'].join(', ') }}
            </div>
          </div>
          <div class="mb-3">
            <label class="form-label">URL / Address</label>
            <input type="text" class="form-control" :class="{'is-invalid': errors[path + '/contactPoints/' + index + '/channels/' + cIndex + '/url']}" placeholder="https://... or mailto:..." :value="channel.url" @input="updateChannel(index, cIndex, 'url', $event.target.value)">
            <div class="invalid-feedback" v-if="errors[path + '/contactPoints/' + index + '/channels/' + cIndex + '/url']">
              {{ errors[path + '/contactPoints/' + index + '/channels/' + cIndex + '/url'].join(', ') }}
            </div>
          </div>
        </div>
        <button class="btn btn-secondary btn-sm mt-2" @click="addChannel(index)">Add Channel</button>
      </div>
      <button class="btn btn-secondary btn-sm mt-2 mb-4" @click="addContactPoint">Add Contact Point</button>

      <!-- Hours Available -->
      <h6>Hours Available</h6>
      <div v-for="(hours, index) in safeSupportPolicy.hoursAvailable" :key="index" class="card mb-2 p-2">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <span>Hours #{{ index + 1 }}</span>
          <div>
            <button class="btn btn-outline-primary btn-sm me-2" @click="setWorkdays(index)">Workdays (Mon-Fri, 9-17)</button>
            <button class="btn btn-outline-primary btn-sm me-2" @click="set24x7(index)">24x7 (Mon-Sun, 00-24)</button>
            <button class="btn btn-danger btn-sm" @click="removeHours(index)">Remove</button>
          </div>
        </div>
        <div class="mb-3">
          <label class="form-label d-block">Day of Week</label>
          <div v-for="day in ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']" :key="day" class="form-check form-check-inline">
            <input 
              class="form-check-input" 
              type="checkbox" 
              :id="'day-' + index + '-' + day" 
              :checked="hours.dayOfWeek && hours.dayOfWeek.includes(day)"
              @change="toggleDay(index, day, $event.target.checked)"
            >
            <label class="form-check-label" :for="'day-' + index + '-' + day">{{ day }}</label>
          </div>
          <div class="text-danger small" v-if="errors[path + '/hoursAvailable/' + index + '/dayOfWeek']">
            {{ errors[path + '/hoursAvailable/' + index + '/dayOfWeek'].join(', ') }}
          </div>
        </div>
        <div class="mb-3">
          <label class="form-label">Opens (HH:mm)</label>
          <input type="text" class="form-control" :class="{'is-invalid': errors[path + '/hoursAvailable/' + index + '/opens']}" placeholder="HH:mm" :value="hours.opens" @input="updateHours(index, 'opens', $event.target.value)">
          <div class="invalid-feedback" v-if="errors[path + '/hoursAvailable/' + index + '/opens']">
            {{ errors[path + '/hoursAvailable/' + index + '/opens'].join(', ') }}
          </div>
        </div>
        <div class="mb-3">
          <label class="form-label">Closes (HH:mm)</label>
          <input type="text" class="form-control" :class="{'is-invalid': errors[path + '/hoursAvailable/' + index + '/closes']}" placeholder="HH:mm" :value="hours.closes" @input="updateHours(index, 'closes', $event.target.value)">
          <div class="invalid-feedback" v-if="errors[path + '/hoursAvailable/' + index + '/closes']">
            {{ errors[path + '/hoursAvailable/' + index + '/closes'].join(', ') }}
          </div>
        </div>
      </div>
      <button class="btn btn-secondary btn-sm mt-2" @click="addHours">Add Hours</button>

      <!-- Holiday Schedule -->
      <h6 class="mt-4">Holiday Schedule</h6>
      <div v-for="(source, index) in safeSupportPolicy.holidaySchedule ? safeSupportPolicy.holidaySchedule.sources : []" :key="index" class="card mb-2 p-2">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <span>Source #{{ index + 1 }}</span>
          <button class="btn btn-danger btn-sm" @click="removeHolidaySource(index)">Remove</button>
        </div>
        <div class="mb-3">
          <label class="form-label">Type</label>
          <select class="form-select" :class="{'is-invalid': errors[path + '/holidaySchedule/sources/' + index + '/type']}" :value="source.type" @change="updateHolidaySource(index, 'type', $event.target.value)">
            <option value="region">Region</option>
            <option value="ical">iCal</option>
            <option value="manual">Manual</option>
          </select>
          <div class="invalid-feedback" v-if="errors[path + '/holidaySchedule/sources/' + index + '/type']">
            {{ errors[path + '/holidaySchedule/sources/' + index + '/type'].join(', ') }}
          </div>
        </div>
        <div v-if="source.type === 'region'" class="mb-3">
          <label class="form-label">Region Code</label>
          <input type="text" class="form-control" :class="{'is-invalid': errors[path + '/holidaySchedule/sources/' + index + '/regionCode']}" placeholder="e.g., DE-BY" :value="source.regionCode" @input="updateHolidaySource(index, 'regionCode', $event.target.value)">
          <div class="invalid-feedback" v-if="errors[path + '/holidaySchedule/sources/' + index + '/regionCode']">
            {{ errors[path + '/holidaySchedule/sources/' + index + '/regionCode'].join(', ') }}
          </div>
        </div>
        <div v-if="source.type === 'ical'" class="mb-3">
          <label class="form-label">Calendar URL</label>
          <input type="text" class="form-control" :class="{'is-invalid': errors[path + '/holidaySchedule/sources/' + index + '/calendarUrl']}" placeholder="https://example.com/holidays.ics" :value="source.calendarUrl" @input="updateHolidaySource(index, 'calendarUrl', $event.target.value)">
          <div class="invalid-feedback" v-if="errors[path + '/holidaySchedule/sources/' + index + '/calendarUrl']">
            {{ errors[path + '/holidaySchedule/sources/' + index + '/calendarUrl'].join(', ') }}
          </div>
        </div>
        <div v-if="source.type === 'manual'" class="mb-3">
          <label class="form-label">Dates (comma-separated YYYY-MM-DD)</label>
          <input type="text" class="form-control" :class="{'is-invalid': errors[path + '/holidaySchedule/sources/' + index + '/dates']}" placeholder="e.g., 2024-01-01,2024-12-25" :value="source.dates ? source.dates.join(',') : ''" @input="updateHolidaySource(index, 'dates', $event.target.value.split(',').map(s => s.trim()))">
          <div class="invalid-feedback" v-if="errors[path + '/holidaySchedule/sources/' + index + '/dates']">
            {{ errors[path + '/holidaySchedule/sources/' + index + '/dates'].join(', ') }}
          </div>
        </div>
      </div>
      <button class="btn btn-secondary btn-sm mt-2" @click="addHolidaySource">Add Holiday Source</button>

      <!-- Service Level Objectives -->
      <h6 class="mt-4">Service Level Objectives (SLOs)</h6>
      <div v-for="(slo, index) in safeSupportPolicy.serviceLevelObjectives" :key="index" class="card mb-2 p-2">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <span>SLO #{{ index + 1 }}</span>
          <button class="btn btn-danger btn-sm" @click="removeSlo(index)">Remove</button>
        </div>
        <div class="mb-3">
          <label class="form-label">Priority</label>
          <input type="text" class="form-control" :class="{'is-invalid': errors[path + '/serviceLevelObjectives/' + index + '/priority']}" placeholder="e.g., High" :value="slo.priority" @input="updateSlo(index, 'priority', $event.target.value)">
          <div class="invalid-feedback" v-if="errors[path + '/serviceLevelObjectives/' + index + '/priority']">
            {{ errors[path + '/serviceLevelObjectives/' + index + '/priority'].join(', ') }}
          </div>
        </div>
        <div class="mb-3">
          <label class="form-label">Name</label>
          <input type="text" class="form-control" :class="{'is-invalid': errors[path + '/serviceLevelObjectives/' + index + '/name']}" placeholder="e.g., Incident Resolution" :value="slo.name" @input="updateSlo(index, 'name', $event.target.value)">
          <div class="invalid-feedback" v-if="errors[path + '/serviceLevelObjectives/' + index + '/name']">
            {{ errors[path + '/serviceLevelObjectives/' + index + '/name'].join(', ') }}
          </div>
        </div>
        <h6>Guarantees for SLO</h6>
        <div v-for="(guarantee, gIndex) in slo.guarantees" :key="gIndex" class="card mb-2 p-2">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <span>Guar. #{{ gIndex + 1 }}</span>
            <button class="btn btn-danger btn-sm" @click="removeSloGuarantee(index, gIndex)">Remove</button>
          </div>
          <div class="mb-3">
            <div class="d-flex gap-3 mb-2">
              <div class="form-check">
                <input class="form-check-input" type="radio" :name="'slo-mode-' + index + '-' + gIndex" :id="'slo-mode-structured-' + index + '-' + gIndex" 
                  :checked="getSloGuaranteeMode(guarantee) === 'structured'" 
                  @change="setSloGuaranteeMode(index, gIndex, 'structured')">
                <label class="form-check-label small" :for="'slo-mode-structured-' + index + '-' + gIndex">
                  Structured (Recommended)
                </label>
              </div>
              <div class="form-check">
                <input class="form-check-input" type="radio" :name="'slo-mode-' + index + '-' + gIndex" :id="'slo-mode-legacy-' + index + '-' + gIndex" 
                  :checked="getSloGuaranteeMode(guarantee) === 'legacy'" 
                  @change="setSloGuaranteeMode(index, gIndex, 'legacy')">
                <label class="form-check-label small" :for="'slo-mode-legacy-' + index + '-' + gIndex">
                  Simple Duration (Legacy)
                </label>
              </div>
            </div>

            <label class="form-label">Metric</label>
            <select class="form-select" :class="{'is-invalid': errors[path + '/serviceLevelObjectives/' + index + '/guarantees/' + gIndex + '/metric']}" :value="guarantee.metric" @change="updateSloGuarantee(index, gIndex, 'metric', $event.target.value)">
              <option value="" disabled>Select metric</option>
              <option v-for="(metric, name) in metrics" :key="name" :value="name">{{ name }}</option>
            </select>
            <div class="invalid-feedback" v-if="errors[path + '/serviceLevelObjectives/' + index + '/guarantees/' + gIndex + '/metric']">
              {{ errors[path + '/serviceLevelObjectives/' + index + '/guarantees/' + gIndex + '/metric'].join(', ') }}
            </div>
          </div>

          <template v-if="getSloGuaranteeMode(guarantee) === 'structured'">
            <div class="row g-2">
              <div class="col-md-4 mb-2">
                <label class="form-label">Operator</label>
                <select class="form-select" :class="{'is-invalid': errors[path + '/serviceLevelObjectives/' + index + '/guarantees/' + gIndex + '/operator']}" :value="guarantee.operator" @change="updateSloGuarantee(index, gIndex, 'operator', $event.target.value)">
                  <option value="">None</option>
                  <option value=">">></option>
                  <option value="<"><</option>
                  <option value=">=">>=</option>
                  <option value="<="><=</option>
                  <option value="=">=</option>
                  <option value="between">between</option>
                  <option value="avg">avg</option>
                </select>
              </div>
              
              <div class="col-md-8 mb-2">
                <label class="form-label">Value</label>
                <input type="text" class="form-control" :class="{'is-invalid': errors[path + '/serviceLevelObjectives/' + index + '/guarantees/' + gIndex + '/value']}" placeholder="Value" :value="guarantee.value" @input="updateSloGuarantee(index, gIndex, 'value', $event.target.value)">
              </div>
            </div>

            <div class="mb-2">
              <DurationEditor 
                :model-value="guarantee.period" 
                :errors="errors"
                :path="path + '/serviceLevelObjectives/' + index + '/guarantees/' + gIndex + '/period'"
                @update:model-value="updateSloGuarantee(index, gIndex, 'period', $event)"
                label="Period"
              />
            </div>
          </template>

          <template v-else>
            <div class="mt-2 pt-2 border-top">
              <DurationEditor 
                :model-value="guarantee.duration" 
                :errors="errors"
                :path="path + '/serviceLevelObjectives/' + index + '/guarantees/' + gIndex + '/duration'"
                @update:model-value="updateSloGuarantee(index, gIndex, 'duration', $event)"
                label="Duration"
              />
            </div>
          </template>
        </div>
        <button class="btn btn-secondary btn-sm mt-2" @click="addSloGuarantee(index)">Add SLO Guarantee</button>
      </div>
      <button class="btn btn-secondary btn-sm mt-2" @click="addSlo">Add SLO</button>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import DurationEditor from './DurationEditor.vue';

export default {
  name: 'SupportPolicyEditor',
  components: {
    DurationEditor
  },
  props: {
    supportPolicy: {
      type: Object,
      default: () => ({}),
    },
    metrics: {
      type: Object,
      default: () => ({}),
    },
    errors: {
      type: Object,
      default: () => ({}),
    },
    path: {
      type: String,
      default: '',
    },
  },
  emits: ['update:supportPolicy'],
  setup(props, { emit }) {
    const safeSupportPolicy = computed(() => props.supportPolicy || {});

    const updateSupportPolicy = (newPolicy) => {
      emit('update:supportPolicy', newPolicy);
    };

    // Hours Available methods
    const addHours = () => {
      const newPolicy = { ...safeSupportPolicy.value };
      if (!newPolicy.hoursAvailable) {
        newPolicy.hoursAvailable = [];
      }
      newPolicy.hoursAvailable.push({ dayOfWeek: [], opens: '', closes: '' });
      updateSupportPolicy(newPolicy);
    };

    const updateHours = (index, key, value) => {
      const newPolicy = { ...safeSupportPolicy.value };
      newPolicy.hoursAvailable[index] = { ...newPolicy.hoursAvailable[index], [key]: value };
      updateSupportPolicy(newPolicy);
    };

    const removeHours = (index) => {
      const newPolicy = { ...safeSupportPolicy.value };
      newPolicy.hoursAvailable.splice(index, 1);
      updateSupportPolicy(newPolicy);
    };

    const toggleDay = (hoursIndex, day, checked) => {
      const newPolicy = { ...safeSupportPolicy.value };
      const hours = { ...newPolicy.hoursAvailable[hoursIndex] };
      const days = hours.dayOfWeek ? [...hours.dayOfWeek] : [];
      
      if (checked) {
        if (!days.includes(day)) days.push(day);
      } else {
        const idx = days.indexOf(day);
        if (idx > -1) days.splice(idx, 1);
      }
      
      hours.dayOfWeek = days;
      newPolicy.hoursAvailable[hoursIndex] = hours;
      updateSupportPolicy(newPolicy);
    };

    const setWorkdays = (index) => {
      const newPolicy = { ...safeSupportPolicy.value };
      newPolicy.hoursAvailable[index] = {
        ...newPolicy.hoursAvailable[index],
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '17:00'
      };
      updateSupportPolicy(newPolicy);
    };

    const set24x7 = (index) => {
      const newPolicy = { ...safeSupportPolicy.value };
      newPolicy.hoursAvailable[index] = {
        ...newPolicy.hoursAvailable[index],
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '00:00',
        closes: '23:59'
      };
      updateSupportPolicy(newPolicy);
    };

    // Holiday Schedule methods
    const addHolidaySource = () => {
      const newPolicy = { ...safeSupportPolicy.value };
      if (!newPolicy.holidaySchedule) {
        newPolicy.holidaySchedule = { sources: [] };
      }
      newPolicy.holidaySchedule.sources.push({ type: 'region' }); // Default to region
      updateSupportPolicy(newPolicy);
    };

    const updateHolidaySource = (index, key, value) => {
      const newPolicy = { ...safeSupportPolicy.value };
      newPolicy.holidaySchedule.sources[index] = { ...newPolicy.holidaySchedule.sources[index], [key]: value };
      updateSupportPolicy(newPolicy);
    };

    const removeHolidaySource = (index) => {
      const newPolicy = { ...safeSupportPolicy.value };
      newPolicy.holidaySchedule.sources.splice(index, 1);
      updateSupportPolicy(newPolicy);
    };

    // Service Level Objectives (SLOs) methods
    const addSlo = () => {
      const newPolicy = { ...safeSupportPolicy.value };
      if (!newPolicy.serviceLevelObjectives) {
        newPolicy.serviceLevelObjectives = [];
      }
      newPolicy.serviceLevelObjectives.push({ priority: '', name: '', guarantees: [] });
      updateSupportPolicy(newPolicy);
    };

    const updateSlo = (index, key, value) => {
      const newPolicy = { ...safeSupportPolicy.value };
      newPolicy.serviceLevelObjectives[index] = { ...newPolicy.serviceLevelObjectives[index], [key]: value };
      updateSupportPolicy(newPolicy);
    };

    const removeSlo = (index) => {
      const newPolicy = { ...safeSupportPolicy.value };
      newPolicy.serviceLevelObjectives.splice(index, 1);
      updateSupportPolicy(newPolicy);
    };

    const addSloGuarantee = (sloIndex) => {
      const newPolicy = { ...safeSupportPolicy.value };
      const slo = newPolicy.serviceLevelObjectives[sloIndex];
      if (!slo.guarantees) {
        slo.guarantees = [];
      }
      slo.guarantees.push({ metric: '' });
      updateSupportPolicy(newPolicy);
    };

    const getSloGuaranteeMode = (guarantee) => {
      if (guarantee.duration !== undefined && guarantee.operator === undefined && guarantee.value === undefined && guarantee.period === undefined) {
        return 'legacy';
      }
      return 'structured';
    };

    const setSloGuaranteeMode = (sloIndex, guaranteeIndex, mode) => {
      const newPolicy = { ...safeSupportPolicy.value };
      const guarantee = { ...newPolicy.serviceLevelObjectives[sloIndex].guarantees[guaranteeIndex] };
      
      if (mode === 'legacy') {
        delete guarantee.operator;
        delete guarantee.value;
        delete guarantee.period;
        if (guarantee.duration === undefined) guarantee.duration = '';
      } else {
        delete guarantee.duration;
      }
      
      newPolicy.serviceLevelObjectives[sloIndex].guarantees[guaranteeIndex] = guarantee;
      updateSupportPolicy(newPolicy);
    };

    const updateSloGuarantee = (sloIndex, guaranteeIndex, key, value) => {
      const newPolicy = { ...safeSupportPolicy.value };
      const guarantee = newPolicy.serviceLevelObjectives[sloIndex].guarantees[guaranteeIndex];
      const newGuarantee = { ...guarantee, [key]: value };
      if (value === '' || value === null || value === undefined) {
        delete newGuarantee[key];
      }
      newPolicy.serviceLevelObjectives[sloIndex].guarantees[guaranteeIndex] = newGuarantee;
      updateSupportPolicy(newPolicy);
    };

    const removeSloGuarantee = (sloIndex, guaranteeIndex) => {
      const newPolicy = { ...safeSupportPolicy.value };
      newPolicy.serviceLevelObjectives[sloIndex].guarantees.splice(guaranteeIndex, 1);
      updateSupportPolicy(newPolicy);
    };

    // Contact Points methods
    const addContactPoint = () => {
      const newPolicy = { ...safeSupportPolicy.value };
      if (!newPolicy.contactPoints) {
        newPolicy.contactPoints = [];
      }
      newPolicy.contactPoints.push({ contactType: '', channels: [] });
      updateSupportPolicy(newPolicy);
    };

    const updateContactPoint = (index, key, value) => {
      const newPolicy = { ...safeSupportPolicy.value };
      newPolicy.contactPoints[index] = { ...newPolicy.contactPoints[index], [key]: value };
      updateSupportPolicy(newPolicy);
    };

    const removeContactPoint = (index) => {
      const newPolicy = { ...safeSupportPolicy.value };
      newPolicy.contactPoints.splice(index, 1);
      updateSupportPolicy(newPolicy);
    };

    const addChannel = (cpIndex) => {
      const newPolicy = { ...safeSupportPolicy.value };
      if (!newPolicy.contactPoints[cpIndex].channels) {
        newPolicy.contactPoints[cpIndex].channels = [];
      }
      newPolicy.contactPoints[cpIndex].channels.push({ type: 'web', url: '' });
      updateSupportPolicy(newPolicy);
    };

    const updateChannel = (cpIndex, cIndex, key, value) => {
      const newPolicy = { ...safeSupportPolicy.value };
      const channel = { ...newPolicy.contactPoints[cpIndex].channels[cIndex], [key]: value };
      
      // Auto-update protocol if type changes
      if (key === 'type') {
        let currentUrl = channel.url || '';
        // Remove existing protocol if it matches one of the known ones
        currentUrl = currentUrl.replace(/^(https?|mailto|tel):\/\//, '');
        
        if (value === 'email') {
          channel.url = 'mailto://' + currentUrl;
        } else if (value === 'phone') {
          channel.url = 'tel://' + currentUrl;
        } else {
          channel.url = 'https://' + currentUrl;
        }
      }
      
      newPolicy.contactPoints[cpIndex].channels[cIndex] = channel;
      updateSupportPolicy(newPolicy);
    };

    const removeChannel = (cpIndex, cIndex) => {
      const newPolicy = { ...safeSupportPolicy.value };
      newPolicy.contactPoints[cpIndex].channels.splice(cIndex, 1);
      updateSupportPolicy(newPolicy);
    };

    return {
      safeSupportPolicy,
      addHours,
      updateHours,
      removeHours,
      toggleDay,
      setWorkdays,
      set24x7,
      addHolidaySource,
      updateHolidaySource,
      removeHolidaySource,
      addSlo,
      updateSlo,
      removeSlo,
      addSloGuarantee,
      updateSloGuarantee,
      removeSloGuarantee,
      getSloGuaranteeMode,
      setSloGuaranteeMode,
      addContactPoint,
      updateContactPoint,
      removeContactPoint,
      addChannel,
      updateChannel,
      removeChannel,
    };
  },
};
</script>
