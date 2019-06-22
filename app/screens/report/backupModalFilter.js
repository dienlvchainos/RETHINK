<Modal
                    isOpen={this.state.isPickTimeVisible}
                    backdropOpacity={0.5}
                    style={[styles.modalPickDate]}
                    position="center"
                    ref={"modalPickDate"}
                    swipeToClose={true}
                    onClosed={this._onCloseModalPickDate.bind(this)}>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                        <View style={{ flex: 1 }}>
                            <View style={styles.contentFilterTime}>
                                <View style={styles.viewInputDateModal}>
                                    <View style={styles.inRow}>
                                        <TextInput style={styles.inputDateModal}
                                            ref={refYear => this.fromYear = refYear}
                                            underlineColorAndroid="transparent"
                                            onChangeText={this._setDateTime.bind(this, 'fromYear')}
                                            value={this.state.rangeTime.fromYear}
                                            keyboardType="numeric" />
                                        <StandardText>년</StandardText>
                                    </View>
                                    <View style={styles.inRow}>
                                        <TextInput style={styles.inputDateModal}
                                            ref={refMonth => this.fromMonth = refMonth}
                                            underlineColorAndroid="transparent"
                                            onChangeText={this._setDateTime.bind(this, 'fromMonth')}
                                            value={this.state.rangeTime.fromMonth}
                                            keyboardType="numeric"
                                            onFocus={this._initSetMonth.bind(this, 'fromMonth')} />
                                        <StandardText>월</StandardText>
                                    </View>
                                    <StandardText style={{ flex: 1, textAlign: 'center' }}> ~ </StandardText>
                                    <View style={styles.inRow}>
                                        <TextInput style={styles.inputDateModal}
                                            ref={refYear => this.toYear = refYear}
                                            underlineColorAndroid="transparent"
                                            onChangeText={this._setDateTime.bind(this, 'toYear')}
                                            value={this.state.rangeTime.toYear}
                                            keyboardType="numeric" />
                                        <StandardText>년</StandardText>
                                    </View>
                                    <View style={styles.inRow}>
                                        <TextInput style={styles.inputDateModal}
                                            ref={refMonth => this.toMonth = refMonth}
                                            underlineColorAndroid="transparent"
                                            onChangeText={this._setDateTime.bind(this, 'toMonth')}
                                            value={this.state.rangeTime.toMonth}
                                            keyboardType="numeric"
                                            onFocus={this._initSetMonth.bind(this, 'toMonth')} />
                                        <StandardText>월</StandardText>
                                    </View>
                                </View>
                                <View style={styles.viewListMonth}>
                                    {MONTHS.map((m) => (
                                        <TouchableWithoutFeedback key={m.id} onPress={this._pickMonthFilter.bind(this, m.id)}>
                                            <View style={styles.itemMonth}><StandardText>{m.title}</StandardText></View>
                                        </TouchableWithoutFeedback>
                                    ))}
                                </View>
                            </View>
                            <View style={styles.actionFilter}>
                                <SimpleButton
                                    onPress={this._doFilterByDate.bind(this)}
                                    propComponent={{
                                        underlayColor: buttonColor.underlay
                                    }}
                                    style={styles.btnLeftModal}
                                    textStyle={{}}>복사</SimpleButton>
                                <SimpleButton
                                    onPress={this._onCloseModalPickDate.bind(this)}
                                    propComponent={{
                                        underlayColor: buttonColor.underlay
                                    }}
                                    style={styles.btnModal}
                                    textStyle={{}}>삭제</SimpleButton>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>