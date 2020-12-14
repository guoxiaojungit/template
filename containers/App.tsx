import { Route, Switch } from 'legions/router';
import React from 'react';
import { PageContainer } from '../../common/utils/page';
import DmsTodo from './todo';
export default class App extends React.Component {
    constructor(){
        super()
    }
    render() {
        return (
            <PageContainer>
                <Switch>
                    <Route path="/" exact component={DmsTodo}></Route>
                </Switch>
                {this.props.children}
            </PageContainer>
        );
    }
}
