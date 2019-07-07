import MainLayout from './MainLayout';

function BasicLayout(props) {
  return (
    <MainLayout children={props.children} />
  );
}

export default BasicLayout;
