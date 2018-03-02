import Component from '@ember/component';
import RecognizerMixin from 'ember-gestures/mixins/recognizers';
import { computed } from '@ember/object';
import moment from 'moment';

const UTC_OFFSET = '-07:00';

export default Component.extend(RecognizerMixin, {
  recognizers: 'tap',

  classNames: ['session'],
  classNameBindings: ['isBreak', 'isExpanded', 'isNow', 'isPast'],

  now: moment().format(),
  isExpanded: false,
  session: null,

  isBreak: computed('session.name', function() {
    return ['Lunch', 'Snack Break'].includes(this.get('session.name'));
  }),

  isNow: computed('now', 'session.{start,end}', function() {
    return moment(this.get('now')).isBetween(this.get('session.start'), this.get('session.end'));
  }),

  isPast: computed('now', 'session.end', function() {
    return moment(this.get('now')).isAfter(this.get('session.end'));
  }),

  formattedTime: computed('session.{start,end}', function() {
    let startMoment = this._pdxMoment(this.get('session.start'));
    let endMoment = this._pdxMoment(this.get('session.end'));
    let startFormat = (startMoment.format('a') === endMoment.format('a')) ? 'h:mm' : 'h:mma';
    return `${startMoment.format(startFormat)}-${endMoment.format('h:mma')}`;
  }),

  _pdxMoment(timestamp) {
    return moment(timestamp).utcOffset(UTC_OFFSET);
  },

  tap() {
    this.toggleProperty('isExpanded');
  }
});
