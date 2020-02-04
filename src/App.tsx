import React from "react";
// import { useParams, useLocation, useRouteMatch } from "react-router";
import { Route, Switch, Link } from "react-router-dom";
import { Col, Icon, Layout, Menu, Row } from "antd";

import HomePage from "pages/Home";
import ExplorePage from "pages/Explore";
import AccountPage from "pages/Account";
import BlockPage from "pages/Block";
import NewsPage from "pages/News";
import StatisticsPage from "pages/Statistics";
import StatusPage from "pages/Status";

import Search from "components/Search";
import Price from "components/Price";

import "./App.css";
import "antd/dist/antd.css";

const { Header, Content, Footer } = Layout;
const { SubMenu } = Menu;

const App: React.FC = props => {
  // const { match, location, history } = useRouter();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          position: "relative",
          backgroundColor: "white",
          padding: "0 20px",
          width: "100%",
          height: "auto"
        }}
      >
        <Row gutter={[16, 0]} type="flex" style={{ width: "100%" }}>
          <Col
            xs={{ span: 6 }}
            md={{ span: 4 }}
            order={1}
            style={{
              paddingTop: "6px",
              paddingBottom: "6px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between"
            }}
          >
            <Link to="/" style={{ whiteSpace: "nowrap", marginRight: "10px" }}>
              Nano Looker
            </Link>

            <Price />
          </Col>

          <Col xs={{ span: 24, order: 3 }} md={{ span: 12, order: 2 }}>
            <Menu onClick={() => {}} selectedKeys={[]} mode="horizontal">
              <SubMenu
                title={
                  <Link to="/explore">
                    <Icon type="apartment" />
                    Explore
                  </Link>
                }
              >
                <Menu.Item key="representatives">
                  Principal Representatives
                  <Link to="/representatives" />
                </Menu.Item>
              </SubMenu>
              <Menu.Item key="news">
                <Icon type="calendar" />
                News
                <Link to="/news" />
              </Menu.Item>
              <SubMenu
                title={
                  <Link to="/statistics">
                    <Icon type="line-chart" />
                    Statistics
                  </Link>
                }
              >
                <Menu.Item key="representatives">
                  <Icon type="database" />
                  Node Status
                  <Link to="/status" />
                </Menu.Item>
              </SubMenu>
            </Menu>
          </Col>

          <Col
            xs={{ span: 18, order: 2 }}
            md={{ span: 8, order: 3 }}
            style={{ textAlign: "right" }}
          >
            <Search />
          </Col>
        </Row>
      </Header>
      <Content style={{ padding: "20px" }}>
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route path="/explore" component={ExplorePage} />
          <Route path="/account/:account?" component={AccountPage} />
          <Route path="/block/:block?" component={BlockPage} />
          <Route path="/news" component={NewsPage} />
          <Route path="/statistics" component={StatisticsPage} />
          <Route path="/status" component={StatusPage} />
        </Switch>
      </Content>
      <Footer style={{ textAlign: "center" }}>
        <a
          href="https://github.com/running-coder/nanolooker"
          rel="noopener noreferrer"
          target="_blank"
        >
          <Icon type="github" /> Nano Looker
        </a>{" "}
        ©2020 Created by RunningCoder
      </Footer>
    </Layout>
  );
};

export default App;
