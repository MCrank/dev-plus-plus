import PropTypes from 'prop-types';

const articleShape = PropTypes.shape({
  name: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  isCompleted: PropTypes.bool.isRequired,
  completedDate: PropTypes.number.isRequired,
  uid: PropTypes.string.isRequired,
});

export default articleShape;
