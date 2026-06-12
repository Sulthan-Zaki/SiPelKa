import 'package:get/get.dart';
import 'package:front_end_mobile_sipelka/bindings/bindings.dart';
import 'package:front_end_mobile_sipelka/screens/screens.dart';

import 'package:front_end_mobile_sipelka/routes/app_route.dart';

class AppPages {
  static final pages = [
    GetPage(
      name: AppRoutes.login,
      page: () => LoginScreen(),
      binding: LoginBinding(),
    ),

    GetPage(name: AppRoutes.dashboard, page: () => DashboardScreen()),

    GetPage(
      name: AppRoutes.register,
      page: () => const RegisterScreen(),
      binding: RegisterBinding(),
    ),

    GetPage(
      name: AppRoutes.mainNavigation,
      page: () => const MainNavigation(),
    ),

    GetPage(
      name: AppRoutes.dailyLogbook,
      page: () => const DailyLogbookScreen(),
      binding: LogbookBinding(),
    ),

    GetPage(
      name: AppRoutes.proposalSubmission,
      page: () => const ProposalSubmissionScreen(),
      binding: ProposalBinding(),
    ),

    GetPage(
      name: AppRoutes.notifications,
      page: () => const NotificationScreen(),
    ),
    GetPage(
      name: AppRoutes.accountSettings,
      page: () => const AccountSettingsScreen(),
    ),
    GetPage(
      name: AppRoutes.researchStats,
      page: () => const ResearchStatsScreen(),
    ),
    GetPage(
      name: AppRoutes.proposalList,
      page: () => const ProposalListScreen(),
      binding: ProposalBinding(),
    ),
    GetPage(
      name: AppRoutes.activeGrants,
      page: () => const ActiveGrantsScreen(),
      binding: ProposalBinding(),
    ),
    GetPage(
      name: AppRoutes.upcomingDeadlines,
      page: () => const UpcomingDeadlinesScreen(),
    ),
  ];
}
