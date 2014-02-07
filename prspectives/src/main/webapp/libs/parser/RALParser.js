// $ANTLR 3.1.1 C:\\Users\\Manuel\\Desktop\\RAL.g 2014-02-07 04:57:02

var RALParser = function(input, state) {
    if (!state) {
        state = new org.antlr.runtime.RecognizerSharedState();
    }

    (function(){
    }).call(this);

    RALParser.superclass.constructor.call(this, input, state);


         

    /* @todo only create adaptor if output=AST */
    this.adaptor = new org.antlr.runtime.tree.CommonTreeAdaptor();

};

org.antlr.lang.augmentObject(RALParser, {
    T__29: 29,
    T__28: 28,
    T__27: 27,
    T__26: 26,
    T__25: 25,
    T__24: 24,
    LETTER: 5,
    T__23: 23,
    T__22: 22,
    T__21: 21,
    T__20: 20,
    WHITESPACE: 6,
    ID: 4,
    EOF: -1,
    T__9: 9,
    T__8: 8,
    T__7: 7,
    T__30: 30,
    T__19: 19,
    T__31: 31,
    T__32: 32,
    T__33: 33,
    T__16: 16,
    T__34: 34,
    T__15: 15,
    T__18: 18,
    T__17: 17,
    T__12: 12,
    T__11: 11,
    T__14: 14,
    T__13: 13,
    T__10: 10
});

(function(){
// public class variables
var T__29= 29,
    T__28= 28,
    T__27= 27,
    T__26= 26,
    T__25= 25,
    T__24= 24,
    LETTER= 5,
    T__23= 23,
    T__22= 22,
    T__21= 21,
    T__20= 20,
    WHITESPACE= 6,
    ID= 4,
    EOF= -1,
    T__9= 9,
    T__8= 8,
    T__7= 7,
    T__30= 30,
    T__19= 19,
    T__31= 31,
    T__32= 32,
    T__33= 33,
    T__16= 16,
    T__34= 34,
    T__15= 15,
    T__18= 18,
    T__17= 17,
    T__12= 12,
    T__11= 11,
    T__14= 14,
    T__13= 13,
    T__10= 10;

// public instance methods/vars
org.antlr.lang.extend(RALParser, org.antlr.runtime.Parser, {
        
    setTreeAdaptor: function(adaptor) {
        this.adaptor = adaptor;
    },
    getTreeAdaptor: function() {
        return this.adaptor;
    },

    getTokenNames: function() { return RALParser.tokenNames; },
    getGrammarFileName: function() { return "C:\\Users\\Manuel\\Desktop\\RAL.g"; }
});
org.antlr.lang.augmentObject(RALParser.prototype, {

    // inline static return class
    expression_return: (function() {
        RALParser.expression_return = function(){};
        org.antlr.lang.extend(RALParser.expression_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // C:\\Users\\Manuel\\Desktop\\RAL.g:17:1: expression : exprAnd ( 'OR' exprAnd )* ;
    // $ANTLR start "expression"
    expression: function() {
        var retval = new RALParser.expression_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var string_literal2 = null;
         var exprAnd1 = null;
         var exprAnd3 = null;

        var string_literal2_tree=null;

        try {
            // C:\\Users\\Manuel\\Desktop\\RAL.g:17:11: ( exprAnd ( 'OR' exprAnd )* )
            // C:\\Users\\Manuel\\Desktop\\RAL.g:18:3: exprAnd ( 'OR' exprAnd )*
            root_0 = this.adaptor.nil();

            this.pushFollow(RALParser.FOLLOW_exprAnd_in_expression38);
            exprAnd1=this.exprAnd();

            this.state._fsp--;

            this.adaptor.addChild(root_0, exprAnd1.getTree());
            // C:\\Users\\Manuel\\Desktop\\RAL.g:18:11: ( 'OR' exprAnd )*
            loop1:
            do {
                var alt1=2;
                var LA1_0 = this.input.LA(1);

                if ( (LA1_0==7) ) {
                    alt1=1;
                }


                switch (alt1) {
                case 1 :
                    // C:\\Users\\Manuel\\Desktop\\RAL.g:18:13: 'OR' exprAnd
                    string_literal2=this.match(this.input,7,RALParser.FOLLOW_7_in_expression42); 
                    string_literal2_tree = this.adaptor.create(string_literal2);
                    this.adaptor.addChild(root_0, string_literal2_tree);

                    this.pushFollow(RALParser.FOLLOW_exprAnd_in_expression44);
                    exprAnd3=this.exprAnd();

                    this.state._fsp--;

                    this.adaptor.addChild(root_0, exprAnd3.getTree());


                    break;

                default :
                    break loop1;
                }
            } while (true);




            retval.stop = this.input.LT(-1);

            retval.tree = this.adaptor.rulePostProcessing(root_0);
            this.adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);

        }
        catch (re) {
            if (re instanceof org.antlr.runtime.RecognitionException) {
                this.reportError(re);
                this.recover(this.input,re);
                retval.tree = this.adaptor.errorNode(this.input, retval.start, this.input.LT(-1), re);
            } else {
                throw re;
            }
        }
        finally {
        }
        return retval;
    },

    // inline static return class
    exprAnd_return: (function() {
        RALParser.exprAnd_return = function(){};
        org.antlr.lang.extend(RALParser.exprAnd_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // C:\\Users\\Manuel\\Desktop\\RAL.g:20:1: exprAnd : exprBase ( 'AND' ( 'IF POSSIBLE' exprBase | exprBase ) )* ;
    // $ANTLR start "exprAnd"
    exprAnd: function() {
        var retval = new RALParser.exprAnd_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var string_literal5 = null;
        var string_literal6 = null;
         var exprBase4 = null;
         var exprBase7 = null;
         var exprBase8 = null;

        var string_literal5_tree=null;
        var string_literal6_tree=null;

        try {
            // C:\\Users\\Manuel\\Desktop\\RAL.g:20:8: ( exprBase ( 'AND' ( 'IF POSSIBLE' exprBase | exprBase ) )* )
            // C:\\Users\\Manuel\\Desktop\\RAL.g:21:3: exprBase ( 'AND' ( 'IF POSSIBLE' exprBase | exprBase ) )*
            root_0 = this.adaptor.nil();

            this.pushFollow(RALParser.FOLLOW_exprBase_in_exprAnd57);
            exprBase4=this.exprBase();

            this.state._fsp--;

            this.adaptor.addChild(root_0, exprBase4.getTree());
            // C:\\Users\\Manuel\\Desktop\\RAL.g:22:3: ( 'AND' ( 'IF POSSIBLE' exprBase | exprBase ) )*
            loop3:
            do {
                var alt3=2;
                var LA3_0 = this.input.LA(1);

                if ( (LA3_0==8) ) {
                    alt3=1;
                }


                switch (alt3) {
                case 1 :
                    // C:\\Users\\Manuel\\Desktop\\RAL.g:22:5: 'AND' ( 'IF POSSIBLE' exprBase | exprBase )
                    string_literal5=this.match(this.input,8,RALParser.FOLLOW_8_in_exprAnd65); 
                    string_literal5_tree = this.adaptor.create(string_literal5);
                    this.adaptor.addChild(root_0, string_literal5_tree);

                    // C:\\Users\\Manuel\\Desktop\\RAL.g:22:11: ( 'IF POSSIBLE' exprBase | exprBase )
                    var alt2=2;
                    var LA2_0 = this.input.LA(1);

                    if ( (LA2_0==9) ) {
                        alt2=1;
                    }
                    else if ( (LA2_0==10||(LA2_0>=12 && LA2_0<=13)||LA2_0==16||LA2_0==18||(LA2_0>=20 && LA2_0<=21)) ) {
                        alt2=2;
                    }
                    else {
                        var nvae =
                            new org.antlr.runtime.NoViableAltException("", 2, 0, this.input);

                        throw nvae;
                    }
                    switch (alt2) {
                        case 1 :
                            // C:\\Users\\Manuel\\Desktop\\RAL.g:22:13: 'IF POSSIBLE' exprBase
                            string_literal6=this.match(this.input,9,RALParser.FOLLOW_9_in_exprAnd69); 
                            string_literal6_tree = this.adaptor.create(string_literal6);
                            this.adaptor.addChild(root_0, string_literal6_tree);

                            this.pushFollow(RALParser.FOLLOW_exprBase_in_exprAnd71);
                            exprBase7=this.exprBase();

                            this.state._fsp--;

                            this.adaptor.addChild(root_0, exprBase7.getTree());


                            break;
                        case 2 :
                            // C:\\Users\\Manuel\\Desktop\\RAL.g:23:9: exprBase
                            this.pushFollow(RALParser.FOLLOW_exprBase_in_exprAnd82);
                            exprBase8=this.exprBase();

                            this.state._fsp--;

                            this.adaptor.addChild(root_0, exprBase8.getTree());


                            break;

                    }



                    break;

                default :
                    break loop3;
                }
            } while (true);




            retval.stop = this.input.LT(-1);

            retval.tree = this.adaptor.rulePostProcessing(root_0);
            this.adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);

        }
        catch (re) {
            if (re instanceof org.antlr.runtime.RecognitionException) {
                this.reportError(re);
                this.recover(this.input,re);
                retval.tree = this.adaptor.errorNode(this.input, retval.start, this.input.LT(-1), re);
            } else {
                throw re;
            }
        }
        finally {
        }
        return retval;
    },

    // inline static return class
    exprBase_return: (function() {
        RALParser.exprBase_return = function(){};
        org.antlr.lang.extend(RALParser.exprBase_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // C:\\Users\\Manuel\\Desktop\\RAL.g:25:1: exprBase : ( exprSimple | '(' expression ')' | 'NOT' exprBase );
    // $ANTLR start "exprBase"
    exprBase: function() {
        var retval = new RALParser.exprBase_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var char_literal10 = null;
        var char_literal12 = null;
        var string_literal13 = null;
         var exprSimple9 = null;
         var expression11 = null;
         var exprBase14 = null;

        var char_literal10_tree=null;
        var char_literal12_tree=null;
        var string_literal13_tree=null;

        try {
            // C:\\Users\\Manuel\\Desktop\\RAL.g:25:9: ( exprSimple | '(' expression ')' | 'NOT' exprBase )
            var alt4=3;
            switch ( this.input.LA(1) ) {
            case 13:
            case 16:
            case 18:
            case 20:
            case 21:
                alt4=1;
                break;
            case 10:
                alt4=2;
                break;
            case 12:
                alt4=3;
                break;
            default:
                var nvae =
                    new org.antlr.runtime.NoViableAltException("", 4, 0, this.input);

                throw nvae;
            }

            switch (alt4) {
                case 1 :
                    // C:\\Users\\Manuel\\Desktop\\RAL.g:26:3: exprSimple
                    root_0 = this.adaptor.nil();

                    this.pushFollow(RALParser.FOLLOW_exprSimple_in_exprBase98);
                    exprSimple9=this.exprSimple();

                    this.state._fsp--;

                    this.adaptor.addChild(root_0, exprSimple9.getTree());


                    break;
                case 2 :
                    // C:\\Users\\Manuel\\Desktop\\RAL.g:27:5: '(' expression ')'
                    root_0 = this.adaptor.nil();

                    char_literal10=this.match(this.input,10,RALParser.FOLLOW_10_in_exprBase104); 
                    char_literal10_tree = this.adaptor.create(char_literal10);
                    this.adaptor.addChild(root_0, char_literal10_tree);

                    this.pushFollow(RALParser.FOLLOW_expression_in_exprBase106);
                    expression11=this.expression();

                    this.state._fsp--;

                    this.adaptor.addChild(root_0, expression11.getTree());
                    char_literal12=this.match(this.input,11,RALParser.FOLLOW_11_in_exprBase108); 
                    char_literal12_tree = this.adaptor.create(char_literal12);
                    this.adaptor.addChild(root_0, char_literal12_tree);



                    break;
                case 3 :
                    // C:\\Users\\Manuel\\Desktop\\RAL.g:28:5: 'NOT' exprBase
                    root_0 = this.adaptor.nil();

                    string_literal13=this.match(this.input,12,RALParser.FOLLOW_12_in_exprBase115); 
                    string_literal13_tree = this.adaptor.create(string_literal13);
                    this.adaptor.addChild(root_0, string_literal13_tree);

                    this.pushFollow(RALParser.FOLLOW_exprBase_in_exprBase117);
                    exprBase14=this.exprBase();

                    this.state._fsp--;

                    this.adaptor.addChild(root_0, exprBase14.getTree());


                    break;

            }
            retval.stop = this.input.LT(-1);

            retval.tree = this.adaptor.rulePostProcessing(root_0);
            this.adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);

        }
        catch (re) {
            if (re instanceof org.antlr.runtime.RecognitionException) {
                this.reportError(re);
                this.recover(this.input,re);
                retval.tree = this.adaptor.errorNode(this.input, retval.start, this.input.LT(-1), re);
            } else {
                throw re;
            }
        }
        finally {
        }
        return retval;
    },

    // inline static return class
    exprSimple_return: (function() {
        RALParser.exprSimple_return = function(){};
        org.antlr.lang.extend(RALParser.exprSimple_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // C:\\Users\\Manuel\\Desktop\\RAL.g:30:1: exprSimple : ( 'IS' ( personConstraint | 'ASSIGNMENT IN ACTIVITY' activityName | depth 'REPORTED BY' positionConstraint ) | 'HAS' ( groupResourceType groupResourceConstraint | 'CAPABILITY' capabilityConstraint ) | 'SHARES' amount groupResourceType 'WITH' personConstraint | 'REPORTS TO' positionConstraint depth | 'CAN' ( 'DELEGATE WORK TO' positionConstraint | 'HAVE WORK DELEGATED BY' positionConstraint ) );
    // $ANTLR start "exprSimple"
    exprSimple: function() {
        var retval = new RALParser.exprSimple_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var string_literal15 = null;
        var string_literal17 = null;
        var string_literal20 = null;
        var string_literal22 = null;
        var string_literal25 = null;
        var string_literal27 = null;
        var string_literal30 = null;
        var string_literal32 = null;
        var string_literal35 = null;
        var string_literal36 = null;
        var string_literal38 = null;
         var personConstraint16 = null;
         var activityName18 = null;
         var depth19 = null;
         var positionConstraint21 = null;
         var groupResourceType23 = null;
         var groupResourceConstraint24 = null;
         var capabilityConstraint26 = null;
         var amount28 = null;
         var groupResourceType29 = null;
         var personConstraint31 = null;
         var positionConstraint33 = null;
         var depth34 = null;
         var positionConstraint37 = null;
         var positionConstraint39 = null;

        var string_literal15_tree=null;
        var string_literal17_tree=null;
        var string_literal20_tree=null;
        var string_literal22_tree=null;
        var string_literal25_tree=null;
        var string_literal27_tree=null;
        var string_literal30_tree=null;
        var string_literal32_tree=null;
        var string_literal35_tree=null;
        var string_literal36_tree=null;
        var string_literal38_tree=null;

        try {
            // C:\\Users\\Manuel\\Desktop\\RAL.g:30:11: ( 'IS' ( personConstraint | 'ASSIGNMENT IN ACTIVITY' activityName | depth 'REPORTED BY' positionConstraint ) | 'HAS' ( groupResourceType groupResourceConstraint | 'CAPABILITY' capabilityConstraint ) | 'SHARES' amount groupResourceType 'WITH' personConstraint | 'REPORTS TO' positionConstraint depth | 'CAN' ( 'DELEGATE WORK TO' positionConstraint | 'HAVE WORK DELEGATED BY' positionConstraint ) )
            var alt8=5;
            switch ( this.input.LA(1) ) {
            case 13:
                alt8=1;
                break;
            case 16:
                alt8=2;
                break;
            case 18:
                alt8=3;
                break;
            case 20:
                alt8=4;
                break;
            case 21:
                alt8=5;
                break;
            default:
                var nvae =
                    new org.antlr.runtime.NoViableAltException("", 8, 0, this.input);

                throw nvae;
            }

            switch (alt8) {
                case 1 :
                    // C:\\Users\\Manuel\\Desktop\\RAL.g:31:3: 'IS' ( personConstraint | 'ASSIGNMENT IN ACTIVITY' activityName | depth 'REPORTED BY' positionConstraint )
                    root_0 = this.adaptor.nil();

                    string_literal15=this.match(this.input,13,RALParser.FOLLOW_13_in_exprSimple126); 
                    string_literal15_tree = this.adaptor.create(string_literal15);
                    this.adaptor.addChild(root_0, string_literal15_tree);

                    // C:\\Users\\Manuel\\Desktop\\RAL.g:31:8: ( personConstraint | 'ASSIGNMENT IN ACTIVITY' activityName | depth 'REPORTED BY' positionConstraint )
                    var alt5=3;
                    switch ( this.input.LA(1) ) {
                    case ID:
                    case 24:
                    case 26:
                        alt5=1;
                        break;
                    case 14:
                        alt5=2;
                        break;
                    case 7:
                    case 8:
                    case 11:
                    case 15:
                    case 34:
                        alt5=3;
                        break;
                    default:
                        var nvae =
                            new org.antlr.runtime.NoViableAltException("", 5, 0, this.input);

                        throw nvae;
                    }

                    switch (alt5) {
                        case 1 :
                            // C:\\Users\\Manuel\\Desktop\\RAL.g:31:10: personConstraint
                            this.pushFollow(RALParser.FOLLOW_personConstraint_in_exprSimple130);
                            personConstraint16=this.personConstraint();

                            this.state._fsp--;

                            this.adaptor.addChild(root_0, personConstraint16.getTree());


                            break;
                        case 2 :
                            // C:\\Users\\Manuel\\Desktop\\RAL.g:32:12: 'ASSIGNMENT IN ACTIVITY' activityName
                            string_literal17=this.match(this.input,14,RALParser.FOLLOW_14_in_exprSimple143); 
                            string_literal17_tree = this.adaptor.create(string_literal17);
                            this.adaptor.addChild(root_0, string_literal17_tree);

                            this.pushFollow(RALParser.FOLLOW_activityName_in_exprSimple145);
                            activityName18=this.activityName();

                            this.state._fsp--;

                            this.adaptor.addChild(root_0, activityName18.getTree());


                            break;
                        case 3 :
                            // C:\\Users\\Manuel\\Desktop\\RAL.g:33:12: depth 'REPORTED BY' positionConstraint
                            this.pushFollow(RALParser.FOLLOW_depth_in_exprSimple159);
                            depth19=this.depth();

                            this.state._fsp--;

                            this.adaptor.addChild(root_0, depth19.getTree());
                            string_literal20=this.match(this.input,15,RALParser.FOLLOW_15_in_exprSimple161); 
                            string_literal20_tree = this.adaptor.create(string_literal20);
                            this.adaptor.addChild(root_0, string_literal20_tree);

                            this.pushFollow(RALParser.FOLLOW_positionConstraint_in_exprSimple163);
                            positionConstraint21=this.positionConstraint();

                            this.state._fsp--;

                            this.adaptor.addChild(root_0, positionConstraint21.getTree());


                            break;

                    }



                    break;
                case 2 :
                    // C:\\Users\\Manuel\\Desktop\\RAL.g:34:5: 'HAS' ( groupResourceType groupResourceConstraint | 'CAPABILITY' capabilityConstraint )
                    root_0 = this.adaptor.nil();

                    string_literal22=this.match(this.input,16,RALParser.FOLLOW_16_in_exprSimple171); 
                    string_literal22_tree = this.adaptor.create(string_literal22);
                    this.adaptor.addChild(root_0, string_literal22_tree);

                    // C:\\Users\\Manuel\\Desktop\\RAL.g:34:11: ( groupResourceType groupResourceConstraint | 'CAPABILITY' capabilityConstraint )
                    var alt6=2;
                    var LA6_0 = this.input.LA(1);

                    if ( (LA6_0==28||(LA6_0>=30 && LA6_0<=31)) ) {
                        alt6=1;
                    }
                    else if ( (LA6_0==17) ) {
                        alt6=2;
                    }
                    else {
                        var nvae =
                            new org.antlr.runtime.NoViableAltException("", 6, 0, this.input);

                        throw nvae;
                    }
                    switch (alt6) {
                        case 1 :
                            // C:\\Users\\Manuel\\Desktop\\RAL.g:34:13: groupResourceType groupResourceConstraint
                            this.pushFollow(RALParser.FOLLOW_groupResourceType_in_exprSimple175);
                            groupResourceType23=this.groupResourceType();

                            this.state._fsp--;

                            this.adaptor.addChild(root_0, groupResourceType23.getTree());
                            this.pushFollow(RALParser.FOLLOW_groupResourceConstraint_in_exprSimple177);
                            groupResourceConstraint24=this.groupResourceConstraint();

                            this.state._fsp--;

                            this.adaptor.addChild(root_0, groupResourceConstraint24.getTree());


                            break;
                        case 2 :
                            // C:\\Users\\Manuel\\Desktop\\RAL.g:35:8: 'CAPABILITY' capabilityConstraint
                            string_literal25=this.match(this.input,17,RALParser.FOLLOW_17_in_exprSimple187); 
                            string_literal25_tree = this.adaptor.create(string_literal25);
                            this.adaptor.addChild(root_0, string_literal25_tree);

                            this.pushFollow(RALParser.FOLLOW_capabilityConstraint_in_exprSimple189);
                            capabilityConstraint26=this.capabilityConstraint();

                            this.state._fsp--;

                            this.adaptor.addChild(root_0, capabilityConstraint26.getTree());


                            break;

                    }



                    break;
                case 3 :
                    // C:\\Users\\Manuel\\Desktop\\RAL.g:36:5: 'SHARES' amount groupResourceType 'WITH' personConstraint
                    root_0 = this.adaptor.nil();

                    string_literal27=this.match(this.input,18,RALParser.FOLLOW_18_in_exprSimple197); 
                    string_literal27_tree = this.adaptor.create(string_literal27);
                    this.adaptor.addChild(root_0, string_literal27_tree);

                    this.pushFollow(RALParser.FOLLOW_amount_in_exprSimple199);
                    amount28=this.amount();

                    this.state._fsp--;

                    this.adaptor.addChild(root_0, amount28.getTree());
                    this.pushFollow(RALParser.FOLLOW_groupResourceType_in_exprSimple201);
                    groupResourceType29=this.groupResourceType();

                    this.state._fsp--;

                    this.adaptor.addChild(root_0, groupResourceType29.getTree());
                    string_literal30=this.match(this.input,19,RALParser.FOLLOW_19_in_exprSimple203); 
                    string_literal30_tree = this.adaptor.create(string_literal30);
                    this.adaptor.addChild(root_0, string_literal30_tree);

                    this.pushFollow(RALParser.FOLLOW_personConstraint_in_exprSimple205);
                    personConstraint31=this.personConstraint();

                    this.state._fsp--;

                    this.adaptor.addChild(root_0, personConstraint31.getTree());


                    break;
                case 4 :
                    // C:\\Users\\Manuel\\Desktop\\RAL.g:37:5: 'REPORTS TO' positionConstraint depth
                    root_0 = this.adaptor.nil();

                    string_literal32=this.match(this.input,20,RALParser.FOLLOW_20_in_exprSimple212); 
                    string_literal32_tree = this.adaptor.create(string_literal32);
                    this.adaptor.addChild(root_0, string_literal32_tree);

                    this.pushFollow(RALParser.FOLLOW_positionConstraint_in_exprSimple214);
                    positionConstraint33=this.positionConstraint();

                    this.state._fsp--;

                    this.adaptor.addChild(root_0, positionConstraint33.getTree());
                    this.pushFollow(RALParser.FOLLOW_depth_in_exprSimple216);
                    depth34=this.depth();

                    this.state._fsp--;

                    this.adaptor.addChild(root_0, depth34.getTree());


                    break;
                case 5 :
                    // C:\\Users\\Manuel\\Desktop\\RAL.g:38:5: 'CAN' ( 'DELEGATE WORK TO' positionConstraint | 'HAVE WORK DELEGATED BY' positionConstraint )
                    root_0 = this.adaptor.nil();

                    string_literal35=this.match(this.input,21,RALParser.FOLLOW_21_in_exprSimple223); 
                    string_literal35_tree = this.adaptor.create(string_literal35);
                    this.adaptor.addChild(root_0, string_literal35_tree);

                    // C:\\Users\\Manuel\\Desktop\\RAL.g:38:11: ( 'DELEGATE WORK TO' positionConstraint | 'HAVE WORK DELEGATED BY' positionConstraint )
                    var alt7=2;
                    var LA7_0 = this.input.LA(1);

                    if ( (LA7_0==22) ) {
                        alt7=1;
                    }
                    else if ( (LA7_0==23) ) {
                        alt7=2;
                    }
                    else {
                        var nvae =
                            new org.antlr.runtime.NoViableAltException("", 7, 0, this.input);

                        throw nvae;
                    }
                    switch (alt7) {
                        case 1 :
                            // C:\\Users\\Manuel\\Desktop\\RAL.g:38:13: 'DELEGATE WORK TO' positionConstraint
                            string_literal36=this.match(this.input,22,RALParser.FOLLOW_22_in_exprSimple227); 
                            string_literal36_tree = this.adaptor.create(string_literal36);
                            this.adaptor.addChild(root_0, string_literal36_tree);

                            this.pushFollow(RALParser.FOLLOW_positionConstraint_in_exprSimple229);
                            positionConstraint37=this.positionConstraint();

                            this.state._fsp--;

                            this.adaptor.addChild(root_0, positionConstraint37.getTree());


                            break;
                        case 2 :
                            // C:\\Users\\Manuel\\Desktop\\RAL.g:39:8: 'HAVE WORK DELEGATED BY' positionConstraint
                            string_literal38=this.match(this.input,23,RALParser.FOLLOW_23_in_exprSimple239); 
                            string_literal38_tree = this.adaptor.create(string_literal38);
                            this.adaptor.addChild(root_0, string_literal38_tree);

                            this.pushFollow(RALParser.FOLLOW_positionConstraint_in_exprSimple241);
                            positionConstraint39=this.positionConstraint();

                            this.state._fsp--;

                            this.adaptor.addChild(root_0, positionConstraint39.getTree());


                            break;

                    }



                    break;

            }
            retval.stop = this.input.LT(-1);

            retval.tree = this.adaptor.rulePostProcessing(root_0);
            this.adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);

        }
        catch (re) {
            if (re instanceof org.antlr.runtime.RecognitionException) {
                this.reportError(re);
                this.recover(this.input,re);
                retval.tree = this.adaptor.errorNode(this.input, retval.start, this.input.LT(-1), re);
            } else {
                throw re;
            }
        }
        finally {
        }
        return retval;
    },

    // inline static return class
    personConstraint_return: (function() {
        RALParser.personConstraint_return = function(){};
        org.antlr.lang.extend(RALParser.personConstraint_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // C:\\Users\\Manuel\\Desktop\\RAL.g:41:1: personConstraint : ( personName | 'PERSON IN DATA FIELD' dataobject '.' fieldName | 'PERSON WHO DID ACTIVITY' activityName );
    // $ANTLR start "personConstraint"
    personConstraint: function() {
        var retval = new RALParser.personConstraint_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var string_literal41 = null;
        var char_literal43 = null;
        var string_literal45 = null;
         var personName40 = null;
         var dataobject42 = null;
         var fieldName44 = null;
         var activityName46 = null;

        var string_literal41_tree=null;
        var char_literal43_tree=null;
        var string_literal45_tree=null;

        try {
            // C:\\Users\\Manuel\\Desktop\\RAL.g:41:17: ( personName | 'PERSON IN DATA FIELD' dataobject '.' fieldName | 'PERSON WHO DID ACTIVITY' activityName )
            var alt9=3;
            switch ( this.input.LA(1) ) {
            case ID:
                alt9=1;
                break;
            case 24:
                alt9=2;
                break;
            case 26:
                alt9=3;
                break;
            default:
                var nvae =
                    new org.antlr.runtime.NoViableAltException("", 9, 0, this.input);

                throw nvae;
            }

            switch (alt9) {
                case 1 :
                    // C:\\Users\\Manuel\\Desktop\\RAL.g:42:3: personName
                    root_0 = this.adaptor.nil();

                    this.pushFollow(RALParser.FOLLOW_personName_in_personConstraint254);
                    personName40=this.personName();

                    this.state._fsp--;

                    this.adaptor.addChild(root_0, personName40.getTree());


                    break;
                case 2 :
                    // C:\\Users\\Manuel\\Desktop\\RAL.g:43:5: 'PERSON IN DATA FIELD' dataobject '.' fieldName
                    root_0 = this.adaptor.nil();

                    string_literal41=this.match(this.input,24,RALParser.FOLLOW_24_in_personConstraint261); 
                    string_literal41_tree = this.adaptor.create(string_literal41);
                    this.adaptor.addChild(root_0, string_literal41_tree);

                    this.pushFollow(RALParser.FOLLOW_dataobject_in_personConstraint263);
                    dataobject42=this.dataobject();

                    this.state._fsp--;

                    this.adaptor.addChild(root_0, dataobject42.getTree());
                    char_literal43=this.match(this.input,25,RALParser.FOLLOW_25_in_personConstraint265); 
                    char_literal43_tree = this.adaptor.create(char_literal43);
                    this.adaptor.addChild(root_0, char_literal43_tree);

                    this.pushFollow(RALParser.FOLLOW_fieldName_in_personConstraint267);
                    fieldName44=this.fieldName();

                    this.state._fsp--;

                    this.adaptor.addChild(root_0, fieldName44.getTree());


                    break;
                case 3 :
                    // C:\\Users\\Manuel\\Desktop\\RAL.g:44:5: 'PERSON WHO DID ACTIVITY' activityName
                    root_0 = this.adaptor.nil();

                    string_literal45=this.match(this.input,26,RALParser.FOLLOW_26_in_personConstraint274); 
                    string_literal45_tree = this.adaptor.create(string_literal45);
                    this.adaptor.addChild(root_0, string_literal45_tree);

                    this.pushFollow(RALParser.FOLLOW_activityName_in_personConstraint276);
                    activityName46=this.activityName();

                    this.state._fsp--;

                    this.adaptor.addChild(root_0, activityName46.getTree());


                    break;

            }
            retval.stop = this.input.LT(-1);

            retval.tree = this.adaptor.rulePostProcessing(root_0);
            this.adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);

        }
        catch (re) {
            if (re instanceof org.antlr.runtime.RecognitionException) {
                this.reportError(re);
                this.recover(this.input,re);
                retval.tree = this.adaptor.errorNode(this.input, retval.start, this.input.LT(-1), re);
            } else {
                throw re;
            }
        }
        finally {
        }
        return retval;
    },

    // inline static return class
    groupResourceConstraint_return: (function() {
        RALParser.groupResourceConstraint_return = function(){};
        org.antlr.lang.extend(RALParser.groupResourceConstraint_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // C:\\Users\\Manuel\\Desktop\\RAL.g:46:1: groupResourceConstraint : ( groupResourceName | 'IN DATA FIELD' dataobject '.' fieldName );
    // $ANTLR start "groupResourceConstraint"
    groupResourceConstraint: function() {
        var retval = new RALParser.groupResourceConstraint_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var string_literal48 = null;
        var char_literal50 = null;
         var groupResourceName47 = null;
         var dataobject49 = null;
         var fieldName51 = null;

        var string_literal48_tree=null;
        var char_literal50_tree=null;

        try {
            // C:\\Users\\Manuel\\Desktop\\RAL.g:46:24: ( groupResourceName | 'IN DATA FIELD' dataobject '.' fieldName )
            var alt10=2;
            var LA10_0 = this.input.LA(1);

            if ( (LA10_0==ID) ) {
                alt10=1;
            }
            else if ( (LA10_0==27) ) {
                alt10=2;
            }
            else {
                var nvae =
                    new org.antlr.runtime.NoViableAltException("", 10, 0, this.input);

                throw nvae;
            }
            switch (alt10) {
                case 1 :
                    // C:\\Users\\Manuel\\Desktop\\RAL.g:47:3: groupResourceName
                    root_0 = this.adaptor.nil();

                    this.pushFollow(RALParser.FOLLOW_groupResourceName_in_groupResourceConstraint287);
                    groupResourceName47=this.groupResourceName();

                    this.state._fsp--;

                    this.adaptor.addChild(root_0, groupResourceName47.getTree());


                    break;
                case 2 :
                    // C:\\Users\\Manuel\\Desktop\\RAL.g:48:5: 'IN DATA FIELD' dataobject '.' fieldName
                    root_0 = this.adaptor.nil();

                    string_literal48=this.match(this.input,27,RALParser.FOLLOW_27_in_groupResourceConstraint294); 
                    string_literal48_tree = this.adaptor.create(string_literal48);
                    this.adaptor.addChild(root_0, string_literal48_tree);

                    this.pushFollow(RALParser.FOLLOW_dataobject_in_groupResourceConstraint296);
                    dataobject49=this.dataobject();

                    this.state._fsp--;

                    this.adaptor.addChild(root_0, dataobject49.getTree());
                    char_literal50=this.match(this.input,25,RALParser.FOLLOW_25_in_groupResourceConstraint298); 
                    char_literal50_tree = this.adaptor.create(char_literal50);
                    this.adaptor.addChild(root_0, char_literal50_tree);

                    this.pushFollow(RALParser.FOLLOW_fieldName_in_groupResourceConstraint300);
                    fieldName51=this.fieldName();

                    this.state._fsp--;

                    this.adaptor.addChild(root_0, fieldName51.getTree());


                    break;

            }
            retval.stop = this.input.LT(-1);

            retval.tree = this.adaptor.rulePostProcessing(root_0);
            this.adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);

        }
        catch (re) {
            if (re instanceof org.antlr.runtime.RecognitionException) {
                this.reportError(re);
                this.recover(this.input,re);
                retval.tree = this.adaptor.errorNode(this.input, retval.start, this.input.LT(-1), re);
            } else {
                throw re;
            }
        }
        finally {
        }
        return retval;
    },

    // inline static return class
    positionConstraint_return: (function() {
        RALParser.positionConstraint_return = function(){};
        org.antlr.lang.extend(RALParser.positionConstraint_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // C:\\Users\\Manuel\\Desktop\\RAL.g:50:1: positionConstraint : 'POSITION' ( namePosition | 'OF' personConstraint ) ;
    // $ANTLR start "positionConstraint"
    positionConstraint: function() {
        var retval = new RALParser.positionConstraint_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var string_literal52 = null;
        var string_literal54 = null;
         var namePosition53 = null;
         var personConstraint55 = null;

        var string_literal52_tree=null;
        var string_literal54_tree=null;

        try {
            // C:\\Users\\Manuel\\Desktop\\RAL.g:50:19: ( 'POSITION' ( namePosition | 'OF' personConstraint ) )
            // C:\\Users\\Manuel\\Desktop\\RAL.g:51:3: 'POSITION' ( namePosition | 'OF' personConstraint )
            root_0 = this.adaptor.nil();

            string_literal52=this.match(this.input,28,RALParser.FOLLOW_28_in_positionConstraint311); 
            string_literal52_tree = this.adaptor.create(string_literal52);
            this.adaptor.addChild(root_0, string_literal52_tree);

            // C:\\Users\\Manuel\\Desktop\\RAL.g:51:14: ( namePosition | 'OF' personConstraint )
            var alt11=2;
            var LA11_0 = this.input.LA(1);

            if ( (LA11_0==ID) ) {
                alt11=1;
            }
            else if ( (LA11_0==29) ) {
                alt11=2;
            }
            else {
                var nvae =
                    new org.antlr.runtime.NoViableAltException("", 11, 0, this.input);

                throw nvae;
            }
            switch (alt11) {
                case 1 :
                    // C:\\Users\\Manuel\\Desktop\\RAL.g:51:16: namePosition
                    this.pushFollow(RALParser.FOLLOW_namePosition_in_positionConstraint315);
                    namePosition53=this.namePosition();

                    this.state._fsp--;

                    this.adaptor.addChild(root_0, namePosition53.getTree());


                    break;
                case 2 :
                    // C:\\Users\\Manuel\\Desktop\\RAL.g:52:18: 'OF' personConstraint
                    string_literal54=this.match(this.input,29,RALParser.FOLLOW_29_in_positionConstraint335); 
                    string_literal54_tree = this.adaptor.create(string_literal54);
                    this.adaptor.addChild(root_0, string_literal54_tree);

                    this.pushFollow(RALParser.FOLLOW_personConstraint_in_positionConstraint337);
                    personConstraint55=this.personConstraint();

                    this.state._fsp--;

                    this.adaptor.addChild(root_0, personConstraint55.getTree());


                    break;

            }




            retval.stop = this.input.LT(-1);

            retval.tree = this.adaptor.rulePostProcessing(root_0);
            this.adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);

        }
        catch (re) {
            if (re instanceof org.antlr.runtime.RecognitionException) {
                this.reportError(re);
                this.recover(this.input,re);
                retval.tree = this.adaptor.errorNode(this.input, retval.start, this.input.LT(-1), re);
            } else {
                throw re;
            }
        }
        finally {
        }
        return retval;
    },

    // inline static return class
    groupResourceType_return: (function() {
        RALParser.groupResourceType_return = function(){};
        org.antlr.lang.extend(RALParser.groupResourceType_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // C:\\Users\\Manuel\\Desktop\\RAL.g:54:1: groupResourceType : ( 'POSITION' | 'ROLE' | 'UNIT' );
    // $ANTLR start "groupResourceType"
    groupResourceType: function() {
        var retval = new RALParser.groupResourceType_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var set56 = null;

        var set56_tree=null;

        try {
            // C:\\Users\\Manuel\\Desktop\\RAL.g:54:18: ( 'POSITION' | 'ROLE' | 'UNIT' )
            // C:\\Users\\Manuel\\Desktop\\RAL.g:
            root_0 = this.adaptor.nil();

            set56=this.input.LT(1);
            if ( this.input.LA(1)==28||(this.input.LA(1)>=30 && this.input.LA(1)<=31) ) {
                this.input.consume();
                this.adaptor.addChild(root_0, this.adaptor.create(set56));
                this.state.errorRecovery=false;
            }
            else {
                var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                throw mse;
            }




            retval.stop = this.input.LT(-1);

            retval.tree = this.adaptor.rulePostProcessing(root_0);
            this.adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);

        }
        catch (re) {
            if (re instanceof org.antlr.runtime.RecognitionException) {
                this.reportError(re);
                this.recover(this.input,re);
                retval.tree = this.adaptor.errorNode(this.input, retval.start, this.input.LT(-1), re);
            } else {
                throw re;
            }
        }
        finally {
        }
        return retval;
    },

    // inline static return class
    amount_return: (function() {
        RALParser.amount_return = function(){};
        org.antlr.lang.extend(RALParser.amount_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // C:\\Users\\Manuel\\Desktop\\RAL.g:59:1: amount : ( 'SOME' | 'ALL' );
    // $ANTLR start "amount"
    amount: function() {
        var retval = new RALParser.amount_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var set57 = null;

        var set57_tree=null;

        try {
            // C:\\Users\\Manuel\\Desktop\\RAL.g:59:8: ( 'SOME' | 'ALL' )
            // C:\\Users\\Manuel\\Desktop\\RAL.g:
            root_0 = this.adaptor.nil();

            set57=this.input.LT(1);
            if ( (this.input.LA(1)>=32 && this.input.LA(1)<=33) ) {
                this.input.consume();
                this.adaptor.addChild(root_0, this.adaptor.create(set57));
                this.state.errorRecovery=false;
            }
            else {
                var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                throw mse;
            }




            retval.stop = this.input.LT(-1);

            retval.tree = this.adaptor.rulePostProcessing(root_0);
            this.adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);

        }
        catch (re) {
            if (re instanceof org.antlr.runtime.RecognitionException) {
                this.reportError(re);
                this.recover(this.input,re);
                retval.tree = this.adaptor.errorNode(this.input, retval.start, this.input.LT(-1), re);
            } else {
                throw re;
            }
        }
        finally {
        }
        return retval;
    },

    // inline static return class
    depth_return: (function() {
        RALParser.depth_return = function(){};
        org.antlr.lang.extend(RALParser.depth_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // C:\\Users\\Manuel\\Desktop\\RAL.g:63:1: depth : ( 'DIRECTLY' )? ;
    // $ANTLR start "depth"
    depth: function() {
        var retval = new RALParser.depth_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var string_literal58 = null;

        var string_literal58_tree=null;

        try {
            // C:\\Users\\Manuel\\Desktop\\RAL.g:63:6: ( ( 'DIRECTLY' )? )
            // C:\\Users\\Manuel\\Desktop\\RAL.g:64:3: ( 'DIRECTLY' )?
            root_0 = this.adaptor.nil();

            // C:\\Users\\Manuel\\Desktop\\RAL.g:64:3: ( 'DIRECTLY' )?
            var alt12=2;
            var LA12_0 = this.input.LA(1);

            if ( (LA12_0==34) ) {
                alt12=1;
            }
            switch (alt12) {
                case 1 :
                    // C:\\Users\\Manuel\\Desktop\\RAL.g:64:4: 'DIRECTLY'
                    string_literal58=this.match(this.input,34,RALParser.FOLLOW_34_in_depth394); 
                    string_literal58_tree = this.adaptor.create(string_literal58);
                    this.adaptor.addChild(root_0, string_literal58_tree);



                    break;

            }




            retval.stop = this.input.LT(-1);

            retval.tree = this.adaptor.rulePostProcessing(root_0);
            this.adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);

        }
        catch (re) {
            if (re instanceof org.antlr.runtime.RecognitionException) {
                this.reportError(re);
                this.recover(this.input,re);
                retval.tree = this.adaptor.errorNode(this.input, retval.start, this.input.LT(-1), re);
            } else {
                throw re;
            }
        }
        finally {
        }
        return retval;
    },

    // inline static return class
    capabilityConstraint_return: (function() {
        RALParser.capabilityConstraint_return = function(){};
        org.antlr.lang.extend(RALParser.capabilityConstraint_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // C:\\Users\\Manuel\\Desktop\\RAL.g:66:1: capabilityConstraint : ID ;
    // $ANTLR start "capabilityConstraint"
    capabilityConstraint: function() {
        var retval = new RALParser.capabilityConstraint_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var ID59 = null;

        var ID59_tree=null;

        try {
            // C:\\Users\\Manuel\\Desktop\\RAL.g:66:22: ( ID )
            // C:\\Users\\Manuel\\Desktop\\RAL.g:66:24: ID
            root_0 = this.adaptor.nil();

            ID59=this.match(this.input,ID,RALParser.FOLLOW_ID_in_capabilityConstraint405); 
            ID59_tree = this.adaptor.create(ID59);
            this.adaptor.addChild(root_0, ID59_tree);




            retval.stop = this.input.LT(-1);

            retval.tree = this.adaptor.rulePostProcessing(root_0);
            this.adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);

        }
        catch (re) {
            if (re instanceof org.antlr.runtime.RecognitionException) {
                this.reportError(re);
                this.recover(this.input,re);
                retval.tree = this.adaptor.errorNode(this.input, retval.start, this.input.LT(-1), re);
            } else {
                throw re;
            }
        }
        finally {
        }
        return retval;
    },

    // inline static return class
    taskName_return: (function() {
        RALParser.taskName_return = function(){};
        org.antlr.lang.extend(RALParser.taskName_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // C:\\Users\\Manuel\\Desktop\\RAL.g:70:1: taskName : ID ;
    // $ANTLR start "taskName"
    taskName: function() {
        var retval = new RALParser.taskName_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var ID60 = null;

        var ID60_tree=null;

        try {
            // C:\\Users\\Manuel\\Desktop\\RAL.g:70:10: ( ID )
            // C:\\Users\\Manuel\\Desktop\\RAL.g:70:12: ID
            root_0 = this.adaptor.nil();

            ID60=this.match(this.input,ID,RALParser.FOLLOW_ID_in_taskName415); 
            ID60_tree = this.adaptor.create(ID60);
            this.adaptor.addChild(root_0, ID60_tree);




            retval.stop = this.input.LT(-1);

            retval.tree = this.adaptor.rulePostProcessing(root_0);
            this.adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);

        }
        catch (re) {
            if (re instanceof org.antlr.runtime.RecognitionException) {
                this.reportError(re);
                this.recover(this.input,re);
                retval.tree = this.adaptor.errorNode(this.input, retval.start, this.input.LT(-1), re);
            } else {
                throw re;
            }
        }
        finally {
        }
        return retval;
    },

    // inline static return class
    personName_return: (function() {
        RALParser.personName_return = function(){};
        org.antlr.lang.extend(RALParser.personName_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // C:\\Users\\Manuel\\Desktop\\RAL.g:72:1: personName : ID ;
    // $ANTLR start "personName"
    personName: function() {
        var retval = new RALParser.personName_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var ID61 = null;

        var ID61_tree=null;

        try {
            // C:\\Users\\Manuel\\Desktop\\RAL.g:72:12: ( ID )
            // C:\\Users\\Manuel\\Desktop\\RAL.g:72:14: ID
            root_0 = this.adaptor.nil();

            ID61=this.match(this.input,ID,RALParser.FOLLOW_ID_in_personName424); 
            ID61_tree = this.adaptor.create(ID61);
            this.adaptor.addChild(root_0, ID61_tree);




            retval.stop = this.input.LT(-1);

            retval.tree = this.adaptor.rulePostProcessing(root_0);
            this.adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);

        }
        catch (re) {
            if (re instanceof org.antlr.runtime.RecognitionException) {
                this.reportError(re);
                this.recover(this.input,re);
                retval.tree = this.adaptor.errorNode(this.input, retval.start, this.input.LT(-1), re);
            } else {
                throw re;
            }
        }
        finally {
        }
        return retval;
    },

    // inline static return class
    activityName_return: (function() {
        RALParser.activityName_return = function(){};
        org.antlr.lang.extend(RALParser.activityName_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // C:\\Users\\Manuel\\Desktop\\RAL.g:74:1: activityName : ( ID )+ ;
    // $ANTLR start "activityName"
    activityName: function() {
        var retval = new RALParser.activityName_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var ID62 = null;

        var ID62_tree=null;

        try {
            // C:\\Users\\Manuel\\Desktop\\RAL.g:74:14: ( ( ID )+ )
            // C:\\Users\\Manuel\\Desktop\\RAL.g:74:16: ( ID )+
            root_0 = this.adaptor.nil();

            // C:\\Users\\Manuel\\Desktop\\RAL.g:74:16: ( ID )+
            var cnt13=0;
            loop13:
            do {
                var alt13=2;
                var LA13_0 = this.input.LA(1);

                if ( (LA13_0==ID) ) {
                    alt13=1;
                }


                switch (alt13) {
                case 1 :
                    // C:\\Users\\Manuel\\Desktop\\RAL.g:74:16: ID
                    ID62=this.match(this.input,ID,RALParser.FOLLOW_ID_in_activityName433); 
                    ID62_tree = this.adaptor.create(ID62);
                    this.adaptor.addChild(root_0, ID62_tree);



                    break;

                default :
                    if ( cnt13 >= 1 ) {
                        break loop13;
                    }
                        var eee = new org.antlr.runtime.EarlyExitException(13, this.input);
                        throw eee;
                }
                cnt13++;
            } while (true);




            retval.stop = this.input.LT(-1);

            retval.tree = this.adaptor.rulePostProcessing(root_0);
            this.adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);

        }
        catch (re) {
            if (re instanceof org.antlr.runtime.RecognitionException) {
                this.reportError(re);
                this.recover(this.input,re);
                retval.tree = this.adaptor.errorNode(this.input, retval.start, this.input.LT(-1), re);
            } else {
                throw re;
            }
        }
        finally {
        }
        return retval;
    },

    // inline static return class
    dataobject_return: (function() {
        RALParser.dataobject_return = function(){};
        org.antlr.lang.extend(RALParser.dataobject_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // C:\\Users\\Manuel\\Desktop\\RAL.g:76:1: dataobject : ID ;
    // $ANTLR start "dataobject"
    dataobject: function() {
        var retval = new RALParser.dataobject_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var ID63 = null;

        var ID63_tree=null;

        try {
            // C:\\Users\\Manuel\\Desktop\\RAL.g:76:12: ( ID )
            // C:\\Users\\Manuel\\Desktop\\RAL.g:76:14: ID
            root_0 = this.adaptor.nil();

            ID63=this.match(this.input,ID,RALParser.FOLLOW_ID_in_dataobject443); 
            ID63_tree = this.adaptor.create(ID63);
            this.adaptor.addChild(root_0, ID63_tree);




            retval.stop = this.input.LT(-1);

            retval.tree = this.adaptor.rulePostProcessing(root_0);
            this.adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);

        }
        catch (re) {
            if (re instanceof org.antlr.runtime.RecognitionException) {
                this.reportError(re);
                this.recover(this.input,re);
                retval.tree = this.adaptor.errorNode(this.input, retval.start, this.input.LT(-1), re);
            } else {
                throw re;
            }
        }
        finally {
        }
        return retval;
    },

    // inline static return class
    fieldName_return: (function() {
        RALParser.fieldName_return = function(){};
        org.antlr.lang.extend(RALParser.fieldName_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // C:\\Users\\Manuel\\Desktop\\RAL.g:78:1: fieldName : ID ;
    // $ANTLR start "fieldName"
    fieldName: function() {
        var retval = new RALParser.fieldName_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var ID64 = null;

        var ID64_tree=null;

        try {
            // C:\\Users\\Manuel\\Desktop\\RAL.g:78:11: ( ID )
            // C:\\Users\\Manuel\\Desktop\\RAL.g:78:13: ID
            root_0 = this.adaptor.nil();

            ID64=this.match(this.input,ID,RALParser.FOLLOW_ID_in_fieldName452); 
            ID64_tree = this.adaptor.create(ID64);
            this.adaptor.addChild(root_0, ID64_tree);




            retval.stop = this.input.LT(-1);

            retval.tree = this.adaptor.rulePostProcessing(root_0);
            this.adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);

        }
        catch (re) {
            if (re instanceof org.antlr.runtime.RecognitionException) {
                this.reportError(re);
                this.recover(this.input,re);
                retval.tree = this.adaptor.errorNode(this.input, retval.start, this.input.LT(-1), re);
            } else {
                throw re;
            }
        }
        finally {
        }
        return retval;
    },

    // inline static return class
    namePosition_return: (function() {
        RALParser.namePosition_return = function(){};
        org.antlr.lang.extend(RALParser.namePosition_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // C:\\Users\\Manuel\\Desktop\\RAL.g:80:1: namePosition : ( ID )+ ;
    // $ANTLR start "namePosition"
    namePosition: function() {
        var retval = new RALParser.namePosition_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var ID65 = null;

        var ID65_tree=null;

        try {
            // C:\\Users\\Manuel\\Desktop\\RAL.g:80:14: ( ( ID )+ )
            // C:\\Users\\Manuel\\Desktop\\RAL.g:80:16: ( ID )+
            root_0 = this.adaptor.nil();

            // C:\\Users\\Manuel\\Desktop\\RAL.g:80:16: ( ID )+
            var cnt14=0;
            loop14:
            do {
                var alt14=2;
                var LA14_0 = this.input.LA(1);

                if ( (LA14_0==ID) ) {
                    alt14=1;
                }


                switch (alt14) {
                case 1 :
                    // C:\\Users\\Manuel\\Desktop\\RAL.g:80:16: ID
                    ID65=this.match(this.input,ID,RALParser.FOLLOW_ID_in_namePosition461); 
                    ID65_tree = this.adaptor.create(ID65);
                    this.adaptor.addChild(root_0, ID65_tree);



                    break;

                default :
                    if ( cnt14 >= 1 ) {
                        break loop14;
                    }
                        var eee = new org.antlr.runtime.EarlyExitException(14, this.input);
                        throw eee;
                }
                cnt14++;
            } while (true);




            retval.stop = this.input.LT(-1);

            retval.tree = this.adaptor.rulePostProcessing(root_0);
            this.adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);

        }
        catch (re) {
            if (re instanceof org.antlr.runtime.RecognitionException) {
                this.reportError(re);
                this.recover(this.input,re);
                retval.tree = this.adaptor.errorNode(this.input, retval.start, this.input.LT(-1), re);
            } else {
                throw re;
            }
        }
        finally {
        }
        return retval;
    },

    // inline static return class
    groupResourceName_return: (function() {
        RALParser.groupResourceName_return = function(){};
        org.antlr.lang.extend(RALParser.groupResourceName_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // C:\\Users\\Manuel\\Desktop\\RAL.g:82:1: groupResourceName : ( ID )+ ;
    // $ANTLR start "groupResourceName"
    groupResourceName: function() {
        var retval = new RALParser.groupResourceName_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var ID66 = null;

        var ID66_tree=null;

        try {
            // C:\\Users\\Manuel\\Desktop\\RAL.g:82:19: ( ( ID )+ )
            // C:\\Users\\Manuel\\Desktop\\RAL.g:82:21: ( ID )+
            root_0 = this.adaptor.nil();

            // C:\\Users\\Manuel\\Desktop\\RAL.g:82:21: ( ID )+
            var cnt15=0;
            loop15:
            do {
                var alt15=2;
                var LA15_0 = this.input.LA(1);

                if ( (LA15_0==ID) ) {
                    alt15=1;
                }


                switch (alt15) {
                case 1 :
                    // C:\\Users\\Manuel\\Desktop\\RAL.g:82:21: ID
                    ID66=this.match(this.input,ID,RALParser.FOLLOW_ID_in_groupResourceName471); 
                    ID66_tree = this.adaptor.create(ID66);
                    this.adaptor.addChild(root_0, ID66_tree);



                    break;

                default :
                    if ( cnt15 >= 1 ) {
                        break loop15;
                    }
                        var eee = new org.antlr.runtime.EarlyExitException(15, this.input);
                        throw eee;
                }
                cnt15++;
            } while (true);




            retval.stop = this.input.LT(-1);

            retval.tree = this.adaptor.rulePostProcessing(root_0);
            this.adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);

        }
        catch (re) {
            if (re instanceof org.antlr.runtime.RecognitionException) {
                this.reportError(re);
                this.recover(this.input,re);
                retval.tree = this.adaptor.errorNode(this.input, retval.start, this.input.LT(-1), re);
            } else {
                throw re;
            }
        }
        finally {
        }
        return retval;
    }

    // Delegated rules




}, true); // important to pass true to overwrite default implementations

 

// public class variables
org.antlr.lang.augmentObject(RALParser, {
    tokenNames: ["<invalid>", "<EOR>", "<DOWN>", "<UP>", "ID", "LETTER", "WHITESPACE", "'OR'", "'AND'", "'IF POSSIBLE'", "'('", "')'", "'NOT'", "'IS'", "'ASSIGNMENT IN ACTIVITY'", "'REPORTED BY'", "'HAS'", "'CAPABILITY'", "'SHARES'", "'WITH'", "'REPORTS TO'", "'CAN'", "'DELEGATE WORK TO'", "'HAVE WORK DELEGATED BY'", "'PERSON IN DATA FIELD'", "'.'", "'PERSON WHO DID ACTIVITY'", "'IN DATA FIELD'", "'POSITION'", "'OF'", "'ROLE'", "'UNIT'", "'SOME'", "'ALL'", "'DIRECTLY'"],
    FOLLOW_exprAnd_in_expression38: new org.antlr.runtime.BitSet([0x00000082, 0x00000000]),
    FOLLOW_7_in_expression42: new org.antlr.runtime.BitSet([0x00353400, 0x00000000]),
    FOLLOW_exprAnd_in_expression44: new org.antlr.runtime.BitSet([0x00000082, 0x00000000]),
    FOLLOW_exprBase_in_exprAnd57: new org.antlr.runtime.BitSet([0x00000102, 0x00000000]),
    FOLLOW_8_in_exprAnd65: new org.antlr.runtime.BitSet([0x00353600, 0x00000000]),
    FOLLOW_9_in_exprAnd69: new org.antlr.runtime.BitSet([0x00353400, 0x00000000]),
    FOLLOW_exprBase_in_exprAnd71: new org.antlr.runtime.BitSet([0x00000102, 0x00000000]),
    FOLLOW_exprBase_in_exprAnd82: new org.antlr.runtime.BitSet([0x00000102, 0x00000000]),
    FOLLOW_exprSimple_in_exprBase98: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_10_in_exprBase104: new org.antlr.runtime.BitSet([0x00353400, 0x00000000]),
    FOLLOW_expression_in_exprBase106: new org.antlr.runtime.BitSet([0x00000800, 0x00000000]),
    FOLLOW_11_in_exprBase108: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_12_in_exprBase115: new org.antlr.runtime.BitSet([0x00353400, 0x00000000]),
    FOLLOW_exprBase_in_exprBase117: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_13_in_exprSimple126: new org.antlr.runtime.BitSet([0x0500C010, 0x00000004]),
    FOLLOW_personConstraint_in_exprSimple130: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_14_in_exprSimple143: new org.antlr.runtime.BitSet([0x00000010, 0x00000000]),
    FOLLOW_activityName_in_exprSimple145: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_depth_in_exprSimple159: new org.antlr.runtime.BitSet([0x00008000, 0x00000000]),
    FOLLOW_15_in_exprSimple161: new org.antlr.runtime.BitSet([0x10000000, 0x00000000]),
    FOLLOW_positionConstraint_in_exprSimple163: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_16_in_exprSimple171: new org.antlr.runtime.BitSet([0xD0020000, 0x00000000]),
    FOLLOW_groupResourceType_in_exprSimple175: new org.antlr.runtime.BitSet([0x08000010, 0x00000000]),
    FOLLOW_groupResourceConstraint_in_exprSimple177: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_17_in_exprSimple187: new org.antlr.runtime.BitSet([0x00000010, 0x00000000]),
    FOLLOW_capabilityConstraint_in_exprSimple189: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_18_in_exprSimple197: new org.antlr.runtime.BitSet([0x00000000, 0x00000003]),
    FOLLOW_amount_in_exprSimple199: new org.antlr.runtime.BitSet([0xD0000000, 0x00000000]),
    FOLLOW_groupResourceType_in_exprSimple201: new org.antlr.runtime.BitSet([0x00080000, 0x00000000]),
    FOLLOW_19_in_exprSimple203: new org.antlr.runtime.BitSet([0x05000010, 0x00000000]),
    FOLLOW_personConstraint_in_exprSimple205: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_20_in_exprSimple212: new org.antlr.runtime.BitSet([0x10000000, 0x00000000]),
    FOLLOW_positionConstraint_in_exprSimple214: new org.antlr.runtime.BitSet([0x00000000, 0x00000004]),
    FOLLOW_depth_in_exprSimple216: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_21_in_exprSimple223: new org.antlr.runtime.BitSet([0x00C00000, 0x00000000]),
    FOLLOW_22_in_exprSimple227: new org.antlr.runtime.BitSet([0x10000000, 0x00000000]),
    FOLLOW_positionConstraint_in_exprSimple229: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_23_in_exprSimple239: new org.antlr.runtime.BitSet([0x10000000, 0x00000000]),
    FOLLOW_positionConstraint_in_exprSimple241: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_personName_in_personConstraint254: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_24_in_personConstraint261: new org.antlr.runtime.BitSet([0x00000010, 0x00000000]),
    FOLLOW_dataobject_in_personConstraint263: new org.antlr.runtime.BitSet([0x02000000, 0x00000000]),
    FOLLOW_25_in_personConstraint265: new org.antlr.runtime.BitSet([0x00000010, 0x00000000]),
    FOLLOW_fieldName_in_personConstraint267: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_26_in_personConstraint274: new org.antlr.runtime.BitSet([0x00000010, 0x00000000]),
    FOLLOW_activityName_in_personConstraint276: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_groupResourceName_in_groupResourceConstraint287: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_27_in_groupResourceConstraint294: new org.antlr.runtime.BitSet([0x00000010, 0x00000000]),
    FOLLOW_dataobject_in_groupResourceConstraint296: new org.antlr.runtime.BitSet([0x02000000, 0x00000000]),
    FOLLOW_25_in_groupResourceConstraint298: new org.antlr.runtime.BitSet([0x00000010, 0x00000000]),
    FOLLOW_fieldName_in_groupResourceConstraint300: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_28_in_positionConstraint311: new org.antlr.runtime.BitSet([0x20000010, 0x00000000]),
    FOLLOW_namePosition_in_positionConstraint315: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_29_in_positionConstraint335: new org.antlr.runtime.BitSet([0x05000010, 0x00000000]),
    FOLLOW_personConstraint_in_positionConstraint337: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_set_in_groupResourceType0: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_set_in_amount0: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_34_in_depth394: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_ID_in_capabilityConstraint405: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_ID_in_taskName415: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_ID_in_personName424: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_ID_in_activityName433: new org.antlr.runtime.BitSet([0x00000012, 0x00000000]),
    FOLLOW_ID_in_dataobject443: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_ID_in_fieldName452: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_ID_in_namePosition461: new org.antlr.runtime.BitSet([0x00000012, 0x00000000]),
    FOLLOW_ID_in_groupResourceName471: new org.antlr.runtime.BitSet([0x00000012, 0x00000000])
});

})();